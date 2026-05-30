const EXCLUDE_JOB_SEEKERS = ' NOT ("open to work" OR "#OpenToWork" OR "opentowork" OR "looking for work" OR "looking for job" OR "job seeker" OR "seeking opportunity" OR resume OR "hire me" OR "available for work")';

window.SEARCH_QUERIES = [
  {
    priority: 1,
    category: 'Bookkeeping Need',
    query: '("need a bookkeeper" OR "looking for a bookkeeper" OR "hiring a bookkeeper" OR "bookkeeper needed")' + EXCLUDE_JOB_SEEKERS
  },
  {
    priority: 2,
    category: 'Contract Bookkeeper',
    query: '("part-time bookkeeper" OR "contract bookkeeper" OR "1099 bookkeeper" OR "remote bookkeeper")' + EXCLUDE_JOB_SEEKERS
  },
  {
    priority: 3,
    category: 'QuickBooks / Cleanup',
    query: '("QuickBooks cleanup" OR "monthly bookkeeping" OR "catch up bookkeeping" OR "bookkeeping help")' + EXCLUDE_JOB_SEEKERS
  },
  {
    priority: 4,
    category: 'Tax Preparer Need',
    query: '("need a tax preparer" OR "looking for a tax preparer" OR "hiring a tax preparer" OR "tax preparer needed")' + EXCLUDE_JOB_SEEKERS
  },
  {
    priority: 5,
    category: 'Business Tax / 1099',
    query: '("business tax return help" OR "1099 help" OR "tax filing help" OR "tax season help")' + EXCLUDE_JOB_SEEKERS
  },
  {
    priority: 6,
    category: 'CPA Firm Support',
    query: '("CPA firm needs tax preparer" OR "CPA firm bookkeeping support" OR "tax season capacity" OR "outsourced tax preparation")' + EXCLUDE_JOB_SEEKERS
  },
  {
    priority: 7,
    category: 'Contract Accounting',
    query: '("contract accounting support" OR "contract hire bookkeeper" OR "part-time accounting support" OR "interim accountant" OR "fractional accounting support")' + EXCLUDE_JOB_SEEKERS
  },
  {
    priority: 8,
    category: 'Seasonal Tax Support',
    query: '("seasonal tax support" OR "temporary tax preparer" OR "freelance tax preparer" OR "1099 tax preparer")' + EXCLUDE_JOB_SEEKERS
  },
  {
    priority: 9,
    category: 'Restaurant Accounting',
    query: '("restaurant bookkeeping" OR "restaurant accounting help" OR "restaurant payroll support")' + EXCLUDE_JOB_SEEKERS
  },
  {
    priority: 10,
    category: 'Payroll Support',
    query: '("payroll support needed" OR "small business payroll help" OR "payroll help")' + EXCLUDE_JOB_SEEKERS
  },
  {
    priority: 11,
    category: 'Outsourced / Virtual',
    query: '("outsourced accounting" OR "virtual bookkeeping" OR "remote accounting support")' + EXCLUDE_JOB_SEEKERS
  },
  {
    priority: 12,
    category: 'Recommendation Posts',
    query: '("recommend a bookkeeper" OR "recommend a tax preparer" OR "anyone know a bookkeeper")' + EXCLUDE_JOB_SEEKERS
  }
];
