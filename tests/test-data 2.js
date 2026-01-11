/**
 * Test data for extractor tests
 * Contains product URLs (should extract successfully) and non-product URLs (should fail)
 * 
 * IMPORTANT: Replace the example URLs with real product URLs for accurate testing
 */

const TEST_URLS = {
  // Amazon
  amazon: {
    product: [
      'https://www.amazon.com/Owala-FreeSip-Insulated-Stainless-BPA-Free/dp/B0BZYCJK89/?_encoding=UTF8&pd_rd_w=tJ9UV&content-id=amzn1.sym.2bb0515d-ce11-4622-b15e-0205f8ad4cc4&pf_rd_p=2bb0515d-ce11-4622-b15e-0205f8ad4cc4&pf_rd_r=3BVWM9JH78PSVN26N0PQ&pd_rd_wg=txRbI&pd_rd_r=75c429ee-16b8-47b6-b147-6651a2602f46&ref_=pd_hp_d_btf_gcx_gw_per_1&th=1', // Example product
      'https://www.amazon.com/Ergonomic-Textures-Comfortable-All-Day-Leopard/dp/B0F6MM11WJ', // Product from earlier
    ],
    nonProduct: [
      'https://www.amazon.com/s?k=laptop', // Search results
      'https://www.amazon.com/gp/browse.html?node=172282', // Category page
    ]
  },
  
  // eBay
  ebay: {
    product: [
      'https://www.ebay.com/itm/334703417715?itmmeta=01KEB465WTFDR8QH1XPS8A5XHY&hash=item4dede0d973:g:EKMAAOSw3rlnftZD&itmprp=enc%3AAQAKAAAA4NHOg0D50eDiCdi%2FfP0r02uIYPJh31yHYeSzvXVfxxfaRVchnNYog1qgFZcYknJeM--03hlaVnFsz0h%2Fg9LOF59%2FCRBL%2FoXVDDYaUvjwNSprHwHNbYIlIZ2dkhzM%2Bc1OHl02FTlVCjldsr8z6ztjxVxIXAYVyDxMTSadVxkrOby%2FNlx%2BihPzWhkdyz5Iz6kZtZxXdQ6EujzNEh4v9Xbw98sgxG4AjMZzbF%2FX4qDLAjqCh0xf7IwLyP9mJByLaC9kKI4k5KDDD2haQbp3dgM80kdbKVHey8qnZBuaPD8g0tMA%7Ctkp%3ABFBMxN6Y5PJm&var=544907135169', // Example - replace with real product
      'https://www.ebay.com/itm/135257679586?_trkparms=itmf%3D1%26aid%3D1110013%26rkt%3D12%26mech%3D1%26algv%3DSimRXIVIWithAspectRecallAndDiversity%26pmt%3D1%26amclksrc%3DITM%26sd%3D334703417715%26sid%3DAQAKAAAAED%2FwshoUpYW9L7LvrA2eKdQ%3D%26itm%3D135257679586%26noa%3D0%26plcampt%3D0%3A75616894015%2C5%3AAG6033686665%7CAG6292279765%26algo%3DHOMESPLICE.SIMRXI%26brand%3DCaterpillar%26asc%3D20250821123744%26ao%3D1%26rk%3D3%26pid%3D101196%26b%3D1%26mehot%3Dnone%26lsid%3D0%26meid%3D926b0d5440844781881c36e669acdeca%26pg%3D2332490&_trksid=p2332490.c101196.m2219&itmprp=cksum%3A135257679586926b0d5440844781881c36e669acdeca%7Cenc%3AAQAKAAABEOqMkuSAG6ItrRvsdD9sfIOitRvq9S3zkbLwWuQv0VbI6jNBMxuv2D6ql7XdjmAaGgUNPwFyLZhgCCnWLOllZPYQh%252F0A%252FQO1KYi7nmRkrviVTDs7t%252BMFMO5lDs8NHOVgLq0hS%252F6ZkZ5QanwWg6RiUFQAyiodNdB4hmkigMABDD7gjNDBNS6UZE6hgOqYfgKCTUZ6bLMgCK10nA0KQgx5%252FaIgtuvMrjCCLIBz%252FjhRjQQrfgZ%252FQRxxv%252FLFLybBOHHRuwfcgSWD8tRdrS0JULxoY51JuQP6wdJuNI8slHGLE2r1fGHDn5fZ%252F8UKrRV2nQMEyHM0I2QEVtio00BRGHhg3em%252Fw8yK77%252B0LjGzFZNLDWw0%7Campid%3APL_CLK%7Cclp%3A2332490',
    ],
    nonProduct: [
      'https://www.ebay.com/b/Collectibles-Art/bn_7000259855', // Search results
      'https://www.ebay.com/b/Electronics/bn_7000259124', // Category page
    ]
  },
  
  // Walmart
  walmart: {
    product: [
      'https://www.walmart.com/ip/Fantaslook-Long-Sleeve-Shirts-for-Women-Casual-Tunic-Tops-Dressy-Crew-Neck-Pullover-Fall-Lightweight-Sweaters-for-Women/16802562537?filters=%5B%7B%22intent%22%3A%22retailer%22%2C%22values%22%3A%5B%22WFS%22%2C%22Pro_Seller%22%5D%7D%5D&classType=VARIANT&athbdg=L1800', // Example - replace with real product
      'https://www.walmart.com/ip/NOW-Sports-Eggwhite-Protein-Powder-Vanilla-Cr-me-20g-Protein-1-5-Lb/52699264?athAsset=eyJhdGhjcGlkIjoiNTI2OTkyNjQiLCJhdGhzdGlkIjoiQ1MwMjAiLCJhdGhhbmNpZCI6Ikl0ZW1DYXJvdXNlbCIsImF0aHJrIjowLjB9&athena=true',
    ],
    nonProduct: [
      'https://www.walmart.com/cp/get-it-fast/6545138', // Category page
      'https://www.walmart.com/search?q=laptop', // Search results
    ]
  },
  
  // Target
  target: {
    product: [
      'https://www.target.com/p/women-s-valentine-s-day-embossed-boucle-sweatpants-joylab-cream/-/A-94835527', // Example - replace with real product
      'https://www.target.com/p/lego-ideas-21349/-/A-90127284#lnk=sametab',
    ],
    nonProduct: [
      'https://www.target.com/c/electronics/-/N-5xtg6', // Category page
      'https://www.target.com/s?searchTerm=laptop', // Search results
    ]
  },
  
  // Best Buy
  bestbuy: {
    product: [
      'https://www.bestbuy.com/product/insignia-55-class-f50-series-led-4k-uhd-smart-fire-tv/J2FPJKSV76', // Example - replace with real product
      'https://www.bestbuy.com/product/asus-rog-strix-scope-ii-96-full-size-wireless-mechanical-gaming-keyboard-with-hot-swappable-rog-nx-snow-switches-black/JJGGLR2VHT',
    ],
    nonProduct: [
      'https://www.bestbuy.com/site/brands/dell/pcmcat140500050010.c?id=pcmcat140500050010', // Category page
      'https://www.bestbuy.com/site/computer-accessories/headsets-microphones/pcmcat304600050012.c?id=pcmcat304600050012', // Search results
    ]
  },
  
  // Etsy
  etsy: {
    product: [
      'https://www.etsy.com/listing/696699936/cd-box-with-leather-handle-felt-basket?ref=rlp-featured-anchor-listing', // Example - replace with real product
      'https://www.etsy.com/listing/1471816257/square-cotton-rope-basket-handmade?ls=a&ref=listing_page_ad_row-2&pro=1&sts=1&plkey=LTa53feccbffd4166a52b1c72e79c57024bca65ee8%3A1471816257&listing_id=1471816257&listing_slug=square-cotton-rope-basket-handmade',
    ],
    nonProduct: [
      'https://www.etsy.com/c/jewelry', // Category page
      'https://www.etsy.com/search?q=necklace', // Search results
    ]
  },
  
  // Temu
  temu: {
    product: [
      'https://www.temu.com/-style-with--24pcs-nail-stickers-featuring-a-pure-and-delicate---a-gentle-and-versatile-look--enhancing--nails-are-designed-to--and----complete-with-jelly--and-a-na-g-606027919529937.html?_oak_mp_inf=ENGv%2BPbd5YkBGiRlZDExOTVjYS1hZmNkLTQyYWUtOTAwZS01Yjc5Y2UxNGRlNWUg5sbNsrkz&top_gallery_url=https%3A%2F%2Fimg.kwcdn.com%2Fproduct%2Ffancy%2Feb97a1f1-c20a-4b6c-8656-715c17929bae.jpg&spec_gallery_id=219584237233&refer_page_sn=10132&refer_source=0&freesia_scene=311&_oak_freesia_scene=311&_oak_rec_ext_1=MjM5&_oak_gallery_order=152717926%2C1653868757%2C547541825%2C631979250&refer_page_el_sn=207153&_x_channel_src=1&_x_channel_scene=spike&_x_sessn_id=4ztbpxwg6y&refer_page_name=lightning-deals&refer_page_id=10132_1767753606510_d6l54f0kpp', // Example - replace with real product
      'https://www.temu.com/8pcs-magnetic-snap-clips-assorted-colors-black--white-no-needle-closure-for-bags-shoes-crafts-durable-stylish-fasteners-bag-accessories-sleek--secure-closure-g-601101557497603.html?_oak_mp_inf=EIP%2Bu%2Bat1ogBGhZmbGFzaF9zYWxlX2xpc3Rfejd0ZXJiIJ3IzbK5Mw%3D%3D&top_gallery_url=https%3A%2F%2Fimg.kwcdn.com%2Fproduct%2Fopen%2F1d4a64e5827043c88ebfb7d2e0560d35-goods.jpeg&spec_gallery_id=601101557497603&refer_page_sn=10132&refer_source=0&freesia_scene=116&_oak_freesia_scene=116&_oak_rec_ext_1=MTYx&refer_page_el_sn=201401&_x_channel_src=1&_x_channel_scene=spike&_x_sessn_id=4ztbpxwg6y&refer_page_name=lightning-deals&refer_page_id=10132_1767753606510_d6l54f0kpp',
    ],
    nonProduct: [
      'https://www.temu.com/category/electronics.html', // Category page
      'https://www.temu.com/search_result.html?search_key=laptop', // Search results
    ]
  },
  
  // Pacsun
  pacsun: {
    product: [
      'https://www.pacsun.com/pacsun/dylan-baggy-jeans-medium-indigo-0131242100057.html?dwvar_0131242100057_color=349&tileCgid=', // Example - replace with real product
      'https://www.pacsun.com/pacsun/casey-low-rise-baggy-contrast-stitch-dark-blue-0860454210392.html?dwvar_0860454210392_color=326&tileCgid=new-arrivals-womens',
    ],
    nonProduct: [
      'https://www.pacsun.com/mens/graphic-tees/', // Category page (like "Men's Clothing")
      'https://www.pacsun.com/search?q=jeans', // Search results
    ]
  },
  
  // Abercrombie
  abercrombie: {
    product: [
      'https://www.abercrombie.com/shop/us/p/essential-premium-polished-relaxed-tee-59146819?seq=15&pageViewMethod=recommendations&pageFindingMethod=recommendations-sample-63669', // Example - replace with real product
      'https://www.abercrombie.com/shop/us/p/a-and-f-quinn-tailored-straight-pant-59888325?seq=03&pageViewMethod=recommendations&pageFindingMethod=recommendations-CoBuy_PDP_Updated_Copy-63669',
    ],
    nonProduct: [
      'https://www.abercrombie.com/shop/us/womens-new-arrivals', // Category page
      'https://www.abercrombie.com/shop/us/search?query=shirt', // Search results
    ]
  },
  
  // Generic (sites without specific extractors)
  generic: {
    product: [
      // Add URLs for sites that use generic extractor
    ],
    nonProduct: [
      // Add non-product URLs
    ]
  }
};

/**
 * Expected results for product pages
 * These are the minimum requirements - at least one of name, price, or image should be extracted
 */
const EXPECTED_RESULTS = {
  amazon: {
    shouldHave: ['name', 'price'], // Must have name and price
    shouldNotHave: []
  },
  ebay: {
    shouldHave: ['name', 'price'],
    shouldNotHave: []
  },
  walmart: {
    shouldHave: ['name', 'price'],
    shouldNotHave: []
  },
  target: {
    shouldHave: ['name', 'price'],
    shouldNotHave: []
  },
  bestbuy: {
    shouldHave: ['name', 'price'],
    shouldNotHave: []
  },
  etsy: {
    shouldHave: ['name', 'price'],
    shouldNotHave: []
  },
  temu: {
    shouldHave: ['price'], // Temu may not have reliable name selector
    shouldNotHave: []
  },
  pacsun: {
    shouldHave: ['name', 'price'],
    shouldNotHave: []
  },
  abercrombie: {
    shouldHave: ['name', 'price'],
    shouldNotHave: []
  },
  generic: {
    shouldHave: [], // At least one field should be extracted
    shouldNotHave: []
  }
};

module.exports = {
    TEST_URLS,
    EXPECTED_RESULTS
  };

