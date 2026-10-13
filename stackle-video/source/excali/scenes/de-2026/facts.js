// Numbers shown on screen, kept in one place with their sources.
// Each line is the script sentence that gives the number, so timing matches the voice.
module.exports = {
  PAY: {
    line: 'The middle of the pay range for a data engineer in the United States is about one hundred sixty thousand dollars a year. Data engineer is also one of the three tech jobs with the most job postings right now.',
    big: '$160,500', small: 'middle of the US pay range for a data engineer',
    source: 'Robert Half 2027 Salary Guide',
    second: 'one of the 3 tech jobs\nwith the most job postings', secondSource: 'Dice tech job report, Q3 2026',
  },
  DEGREE: {
    line: "A 2026 study looked at data engineer job posts in the United States. About three in four mention a bachelor's degree.",
    line2: 'About one in four do not mention education at all.',
    yes: "mention a bachelor's degree", no: 'do not mention education',
    source: '365 Data Science, US data engineer job postings, April 2026',
  },
  AI_STAT: {
    line: 'In the 2026 Stack Overflow survey, eighty-three percent of developers said they use at least one AI tool.',
    big: '83%', small: 'of developers use at least one AI tool', source: 'Stack Overflow Developer Survey 2026',
  },
  AI_RISK: {
    line: 'In a 2026 survey by dbt Labs, seventy-one percent of data teams said they worry that wrong data from AI can reach the people who rely on it.',
    big: '71%', small: 'of data teams worry wrong data from AI\ncan reach the people who rely on it', source: 'dbt Labs, State of Analytics Engineering 2026',
  },
  REFERRAL: {
    line: 'Hiring data from Ashby, which makes hiring software, shows that referrals are about one percent of applications but about seventeen percent of hires.',
    big: '1% of applications  →  17% of hires', source: 'Ashby hiring data, referrals report',
  },
};
