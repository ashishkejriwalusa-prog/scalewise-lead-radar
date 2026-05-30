const EXCLUDE_JOB_SEEKERS = ' NOT OpenToWork NOT "open to work" NOT "looking for work" NOT "looking for job" NOT "job seeker" NOT "seeking opportunity" NOT resume NOT "hire me" NOT "available for work" NOT candidate NOT "my resume"';

window.SEARCH_QUERIES = [
  {
    priority: 1,
    category: 'Bookkeeping Buyer Intent',
    query: '(need OR hiring OR recommend OR referral OR ISO OR "anyone know") AND (bookkeeper OR bookkeeping OR QuickBooks)' + EXCLUDE_JOB_SEEKERS
  },
  {
    priority: 2,
    category: 'Bookkeeper Needed Exact',
    query: '("need a bookkeeper" OR "hiring a bookkeeper" OR "bookkeeper needed" OR "recommend a bookkeeper" OR "anyone know a bookkeeper")' + EXCLUDE_JOB_SEEKERS
  },
  {
    priority: 3,
    category: 'QuickBooks / Cleanup Buyer Intent',
    query: '(need OR hiring OR recommend OR referral OR ISO) AND ("QuickBooks cleanup" OR "catch up bookkeeping" OR "monthly bookkeeping" OR reconciliation)' + EXCLUDE_JOB_SEEKERS
  },
  {
    priority: 4,
    category: 'Tax Preparer Buyer Intent',
    query: '(need OR hiring OR recommend OR referral OR ISO OR "anyone know") AND ("tax preparer" OR "tax preparation" OR "tax filing" OR "business tax")' + EXCLUDE_JOB_SEEKERS
  },
  {
    priority: 5,
    category: 'Tax Preparer Needed Exact',
    query: '("need a tax preparer" OR "hiring a tax preparer" OR "tax preparer needed" OR "recommend a tax preparer" OR "anyone know a tax preparer")' + EXCLUDE_JOB_SEEKERS
  },
  {
    priority: 6,
    category: 'CPA Firm Capacity',
    query: '("CPA firm" OR "accounting firm" OR "tax firm") AND (capacity OR overflow OR outsourced OR seasonal OR support OR hiring)' + EXCLUDE_JOB_SEEKERS
  },
  {
    priority: 7,
    category: 'Contract Accounting Buyer Intent',
    query: '(need OR hiring OR recommend OR ISO) AND ("contract accounting" OR "part-time accounting" OR "interim accountant" OR "fractional accounting" OR "contract bookkeeper")' + EXCLUDE_JOB_SEEKERS
  },
  {
    priority: 8,
    category: 'Seasonal Tax Capacity',
    query: '(need OR hiring OR recommend OR ISO) AND ("seasonal tax" OR "temporary tax" OR "tax season support" OR "tax prep support")' + EXCLUDE_JOB_SEEKERS
  },
  {
    priority: 9,
    category: 'Restaurant Accounting Need',
    query: '(need OR hiring OR recommend OR ISO) AND (restaurant OR cafe OR hospitality) AND (bookkeeping OR accounting OR payroll)' + EXCLUDE_JOB_SEEKERS
  },
  {
    priority: 10,
    category: 'Payroll Support Need',
    query: '(need OR hiring OR recommend OR ISO) AND (payroll OR Gusto OR ADP OR Paychex) AND (support OR help OR service)' + EXCLUDE_JOB_SEEKERS
  },
  {
    priority: 11,
    category: 'Outsourced Accounting Need',
    query: '(need OR hiring OR recommend OR ISO) AND ("outsourced accounting" OR "virtual bookkeeping" OR "remote accounting support")' + EXCLUDE_JOB_SEEKERS
  },
  {
    priority: 12,
    category: 'Recommendation Posts',
    query: '("recommend a bookkeeper" OR "recommend a tax preparer" OR "anyone know a bookkeeper" OR "anyone know a tax preparer" OR "looking for recommendations")' + EXCLUDE_JOB_SEEKERS
  }
];
