window.VERTICAL_SEARCH_GROUPS = [
  {
    vertical: 'CPA Firms',
    description: 'Tax season capacity, outsourced prep, bookkeeping cleanup, and overflow support.',
    searches: [
      { label: 'Tax Season Capacity', query: '("CPA firm" OR "accounting firm" OR "tax firm") AND ("tax season capacity" OR overflow OR seasonal OR support) NOT OpenToWork NOT resume NOT candidate' },
      { label: 'Outsourced Tax Prep', query: '("CPA firm" OR "tax practice") AND ("outsourced tax preparation" OR "tax prep support" OR "seasonal tax preparer") NOT OpenToWork NOT resume NOT candidate' },
      { label: 'Bookkeeping Cleanup Support', query: '("CPA firm" OR "accounting firm") AND ("bookkeeping cleanup" OR "QuickBooks cleanup" OR reconciliation OR "client books") NOT OpenToWork NOT resume NOT candidate' }
    ]
  },
  {
    vertical: 'Restaurants / Hospitality',
    description: 'Restaurant bookkeeping, payroll, sales tax, vendor reconciliation, and cash reporting.',
    searches: [
      { label: 'Restaurant Bookkeeping', query: '(restaurant OR cafe OR hospitality OR bakery OR "food truck") AND ("need a bookkeeper" OR "recommend a bookkeeper" OR "bookkeeping help") NOT OpenToWork NOT resume NOT candidate' },
      { label: 'Restaurant Payroll', query: '(restaurant OR cafe OR hospitality) AND (payroll OR Gusto OR ADP OR Paychex) AND (help OR support OR need OR recommend) NOT OpenToWork NOT resume NOT candidate' },
      { label: 'Sales Tax / Reconciliation', query: '(restaurant OR cafe OR hospitality) AND ("sales tax" OR reconciliation OR "vendor bills" OR QuickBooks) AND (need OR help OR recommend) NOT OpenToWork NOT resume NOT candidate' }
    ]
  },
  {
    vertical: 'Medical / Dental Practices',
    description: 'Bookkeeping, payroll, monthly close, and practice-level financial reporting.',
    searches: [
      { label: 'Dental Bookkeeping', query: '(dental OR dentist OR "dental office") AND ("need a bookkeeper" OR "bookkeeping help" OR QuickBooks OR payroll) NOT OpenToWork NOT resume NOT candidate' },
      { label: 'Medical Practice Accounting', query: '("medical practice" OR clinic OR healthcare) AND (bookkeeping OR accounting OR payroll OR reconciliation) AND (need OR help OR recommend) NOT OpenToWork NOT resume NOT candidate' },
      { label: 'Practice Manager Need', query: '("practice manager" OR "office manager") AND (bookkeeping OR payroll OR QuickBooks OR reconciliation) AND (need OR help OR recommend) NOT OpenToWork NOT resume NOT candidate' }
    ]
  },
  {
    vertical: 'Law Firms',
    description: 'Bookkeeping, payroll, trust/IOLTA support, billing reconciliation, and monthly reporting.',
    searches: [
      { label: 'Law Firm Bookkeeping', query: '("law firm" OR attorney OR lawyer) AND ("need a bookkeeper" OR "bookkeeping help" OR QuickBooks OR reconciliation) NOT OpenToWork NOT resume NOT candidate' },
      { label: 'Legal Billing / Trust', query: '("law firm" OR attorney OR lawyer) AND (IOLTA OR trust OR billing OR reconciliation) AND (help OR support OR need) NOT OpenToWork NOT resume NOT candidate' },
      { label: 'Small Law Firm Accounting', query: '("small law firm" OR "solo attorney") AND (bookkeeping OR payroll OR accounting) AND (need OR recommend OR help) NOT OpenToWork NOT resume NOT candidate' }
    ]
  },
  {
    vertical: 'Real Estate / Property Management',
    description: 'Property-level bookkeeping, rent roll reconciliation, owner reporting, and payroll/vendor support.',
    searches: [
      { label: 'Real Estate Bookkeeping', query: '("real estate" OR realtor OR brokerage) AND ("need a bookkeeper" OR bookkeeping OR QuickBooks OR reconciliation) NOT OpenToWork NOT resume NOT candidate' },
      { label: 'Property Management Accounting', query: '("property management" OR landlord OR "rental properties") AND (bookkeeping OR accounting OR reconciliation OR QuickBooks) AND (need OR help OR recommend) NOT OpenToWork NOT resume NOT candidate' },
      { label: 'Investor / Rentals', query: '("real estate investor" OR "rental property") AND (bookkeeping OR taxes OR QuickBooks OR accounting) AND (need OR help OR recommend) NOT OpenToWork NOT resume NOT candidate' }
    ]
  },
  {
    vertical: 'E-commerce / Shopify',
    description: 'Shopify/Amazon bookkeeping, sales tax, inventory reconciliation, and monthly reporting.',
    searches: [
      { label: 'E-commerce Bookkeeping', query: '(ecommerce OR "e-commerce" OR Shopify OR Amazon) AND ("need a bookkeeper" OR bookkeeping OR QuickBooks OR accounting) NOT OpenToWork NOT resume NOT candidate' },
      { label: 'Sales Tax / Marketplace', query: '(Shopify OR Amazon OR ecommerce OR "e-commerce") AND ("sales tax" OR inventory OR reconciliation OR bookkeeping) AND (need OR help OR recommend) NOT OpenToWork NOT resume NOT candidate' },
      { label: 'Online Store Accounting', query: '("online store" OR Shopify OR WooCommerce) AND (bookkeeping OR accounting OR QuickBooks) AND (need OR help OR recommend) NOT OpenToWork NOT resume NOT candidate' }
    ]
  },
  {
    vertical: 'Startups / SaaS',
    description: 'Monthly close, investor-ready books, reporting, controller support, and light FP&A.',
    searches: [
      { label: 'Startup Bookkeeping', query: '(startup OR founder OR SaaS) AND ("need a bookkeeper" OR bookkeeping OR QuickBooks OR accounting) NOT OpenToWork NOT resume NOT candidate' },
      { label: 'Investor Reporting', query: '(startup OR SaaS OR founder) AND ("monthly close" OR reporting OR "investor reporting" OR FP&A OR controller) AND (need OR help OR support) NOT OpenToWork NOT resume NOT candidate' },
      { label: 'Fractional Accounting', query: '(startup OR founder OR SaaS) AND ("fractional controller" OR "fractional accounting" OR "accounting support") AND (need OR help OR recommend) NOT OpenToWork NOT resume NOT candidate' }
    ]
  },
  {
    vertical: 'Local Small Businesses',
    description: 'General bookkeeping, QuickBooks cleanup, payroll coordination, and tax prep support.',
    searches: [
      { label: 'Small Business Bookkeeping', query: '("small business" OR "business owner" OR "local business") AND ("need a bookkeeper" OR "recommend a bookkeeper" OR "bookkeeping help") NOT OpenToWork NOT resume NOT candidate' },
      { label: 'QuickBooks Cleanup', query: '("small business" OR "business owner") AND ("QuickBooks cleanup" OR "books are behind" OR "catch up bookkeeping") NOT OpenToWork NOT resume NOT candidate' },
      { label: 'Payroll / Tax Support', query: '("small business" OR "business owner") AND (payroll OR "tax preparer" OR "tax filing" OR bookkeeping) AND (need OR help OR recommend) NOT OpenToWork NOT resume NOT candidate' }
    ]
  }
];
