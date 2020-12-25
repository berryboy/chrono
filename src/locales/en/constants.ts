import { OpUnitType } from "dayjs";
import { matchAnyPattern } from "../../utils/pattern";
import { findMostLikelyADYear } from "../../calculation/years";
import { TimeUnits } from "../../utils/timeunits";
import { DictionaryLike } from "../../utils/pattern";

export const WEEKDAY_DICTIONARY: { [word: string]: number } = {
    sunday: 0,
    sun: 0,
    "sun.": 0,
    monday: 1,
    mon: 1,
    "mon.": 1,
    tuesday: 2,
    tue: 2,
    "tue.": 2,
    wednesday: 3,
    wed: 3,
    "wed.": 3,
    thursday: 4,
    thurs: 4,
    "thurs.": 4,
    thur: 4,
    "thur.": 4,
    thu: 4,
    "thu.": 4,
    friday: 5,
    fri: 5,
    "fri.": 5,
    saturday: 6,
    sat: 6,
    "sat.": 6,
};

export const FULL_MONTH_NAME_DICTIONARY: { [word: string]: number } = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
};

export const MONTH_DICTIONARY: { [word: string]: number } = {
    ...FULL_MONTH_NAME_DICTIONARY,
    jan: 1,
    "jan.": 1,
    feb: 2,
    "feb.": 2,
    mar: 3,
    "mar.": 3,
    apr: 4,
    "apr.": 4,
    jun: 6,
    "jun.": 6,
    jul: 7,
    "jul.": 7,
    aug: 8,
    "aug.": 8,
    sep: 9,
    "sep.": 9,
    sept: 9,
    "sept.": 9,
    oct: 10,
    "oct.": 10,
    nov: 11,
    "nov.": 11,
    dec: 12,
    "dec.": 12,
};

export const INTEGER_WORD_DICTIONARY: { [word: string]: number } = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
};

export const ORDINAL_WORD_DICTIONARY: { [word: string]: number } = {
    first: 1,
    second: 2,
    third: 3,
    fourth: 4,
    fifth: 5,
    sixth: 6,
    seventh: 7,
    eighth: 8,
    ninth: 9,
    tenth: 10,
    eleventh: 11,
    twelfth: 12,
    thirteenth: 13,
    fourteenth: 14,
    fifteenth: 15,
    sixteenth: 16,
    seventeenth: 17,
    eighteenth: 18,
    nineteenth: 19,
    twentieth: 20,
    "twenty first": 21,
    "twenty-first": 21,
    "twenty second": 22,
    "twenty-second": 22,
    "twenty third": 23,
    "twenty-third": 23,
    "twenty fourth": 24,
    "twenty-fourth": 24,
    "twenty fifth": 25,
    "twenty-fifth": 25,
    "twenty sixth": 26,
    "twenty-sixth": 26,
    "twenty seventh": 27,
    "twenty-seventh": 27,
    "twenty eighth": 28,
    "twenty-eighth": 28,
    "twenty ninth": 29,
    "twenty-ninth": 29,
    "thirtieth": 30,
    "thirty first": 31,
    "thirty-first": 31,
};

export const TIME_UNIT_DICTIONARY: { [word: string]: OpUnitType } = {
    sec: "second",
    second: "second",
    seconds: "second",
    min: "minute",
    mins: "minute",
    minute: "minute",
    minutes: "minute",
    h: "hour",
    hr: "hour",
    hrs: "hour",
    hour: "hour",
    hours: "hour",
    day: "d",
    days: "d",
    week: "week",
    weeks: "week",
    month: "month",
    months: "month",
    y: "year",
    yr: "year",
    year: "year",
    years: "year",
};

export const SHORT_TIME_UNIT_DICTIONARY: { [letter:string]: OpUnitType } = {
    ms: "millisecond",
    s: "second",
    m: "minute",
    d: "d",
    w: "week",
    wk: "week",
}

export const FULL_TIME_UNIT_DICTIONARY = { ...TIME_UNIT_DICTIONARY, ...SHORT_TIME_UNIT_DICTIONARY }

//-----------------------------

export const NUMBER_PATTERN = `(?:${matchAnyPattern(
    INTEGER_WORD_DICTIONARY
)}|[0-9]+|[0-9]+\\.[0-9]+|half(?:\\s*an?)?|an?(?:\\s*few)?|few|several|a?\\s*couple\\s*(?:of)?)`;

export function parseNumberPattern(match: string): number {
    const num = match.toLowerCase();
    if (INTEGER_WORD_DICTIONARY[num] !== undefined) {
        return INTEGER_WORD_DICTIONARY[num];
    } else if (num === "a" || num === "an") {
        return 1;
    } else if (num.match(/few/)) {
        return 3;
    } else if (num.match(/half/)) {
        return 0.5;
    } else if (num.match(/couple/)) {
        return 2;
    } else if (num.match(/several/)) {
        return 7;
    }

    return parseFloat(num);
}

//-----------------------------

export const ORDINAL_NUMBER_PATTERN = `(?:${matchAnyPattern(ORDINAL_WORD_DICTIONARY)}|[0-9]{1,2}(?:st|nd|rd|th)?)`;
export function parseOrdinalNumberPattern(match: string): number {
    let num = match.toLowerCase();
    if (ORDINAL_WORD_DICTIONARY[num] !== undefined) {
        return ORDINAL_WORD_DICTIONARY[num];
    }

    num = num.replace(/(?:st|nd|rd|th)$/i, "");
    return parseInt(num);
}

//-----------------------------

export const YEAR_PATTERN = `(?:[1-9][0-9]{0,3}\\s*(?:BE|AD|BC)|[1-2][0-9]{3}|[5-9][0-9])`;
export function parseYear(match: string): number {
    if (/BE/i.test(match)) {
        // Buddhist Era
        match = match.replace(/BE/i, "");
        return parseInt(match) - 543;
    }

    if (/BC/i.test(match)) {
        // Before Christ
        match = match.replace(/BC/i, "");
        return -parseInt(match);
    }

    if (/AD/i.test(match)) {
        match = match.replace(/AD/i, "");
        return parseInt(match);
    }

    const rawYearNumber = parseInt(match);
    return findMostLikelyADYear(rawYearNumber);
}

//-----------------------------

const SINGLE_TIME_PATTERN = matchAnyPattern(TIME_UNIT_DICTIONARY);
console.log(SINGLE_TIME_PATTERN);
const SINGLE_TIME_UNIT_PATTERN = createUnitPattern(SINGLE_TIME_PATTERN);
const SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
const SINGLE_TIME_UNIT_PATTERN_NO_CAPTURE = SINGLE_TIME_UNIT_PATTERN.replace(/\((?!\?)/g, "(?:");


const FULL_UNIT_PATTERN = matchAnyPattern(FULL_TIME_UNIT_DICTIONARY);
console.log(FULL_UNIT_PATTERN);
const FULL_TIME_UNIT_PATTERN = createUnitPattern(FULL_UNIT_PATTERN);
const FULL_TIME_UNIT_REGEX = new RegExp(FULL_TIME_UNIT_PATTERN, "i");
const FULL_TIME_UNIT_PATTERN_NO_CAPTURE = FULL_TIME_UNIT_PATTERN.replace(/\((?!\?)/g, "(?:");



export const TIME_UNITS_PATTERN =
    `(?:(?:about|around)\\s*)?` +
    `${SINGLE_TIME_UNIT_PATTERN_NO_CAPTURE}\\s*(?:,?\\s*${SINGLE_TIME_UNIT_PATTERN_NO_CAPTURE})*`;

export const FULL_TIME_UNITS_PATTERN =
    `(?:(?:about|around)\\s*)?` +
    `${FULL_TIME_UNIT_PATTERN_NO_CAPTURE}\\s*(?:,?\\s*${FULL_TIME_UNIT_PATTERN_NO_CAPTURE})*`;

export function parseTimeUnits(timeunitText, useShorts = false): TimeUnits {
    const fragments = {};
    let remainingText = timeunitText;
    const REGEX = useShorts ? FULL_TIME_UNIT_REGEX : SINGLE_TIME_UNIT_REGEX;
    const DICT = useShorts ? FULL_TIME_UNIT_DICTIONARY : TIME_UNIT_DICTIONARY;

    let match = REGEX.exec(remainingText);
    while (match) {
        console.log(`Match: ${match} \n Match[1]: ${match[1]}`)
        collectDateTimeFragment(fragments, match, DICT);
        remainingText = remainingText.substring(match[0].length);
        match = REGEX.exec(remainingText);
    }
    return fragments;
}

function collectDateTimeFragment(fragments, match, DICT: DictionaryLike) {
    const num = parseNumberPattern(match[1]);
    const unit = DICT[match[2].toLowerCase()];
    fragments[unit] = num;
}

function createUnitPattern(pattern: string): string {
    return `(${NUMBER_PATTERN})\\s*(${pattern})\\s*`;
}