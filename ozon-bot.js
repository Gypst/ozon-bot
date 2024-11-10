const puppeteer = require('puppeteer')

// User cofiguration
const linkToWatch =
  'https://www.ozon.ru/product/zubnaya-pasta-president-classic-dlya-ezhednevnoy-zashchity-ot-kariesa-rda-75-75-g-h-2-sht-1036250315/?from_sku=1036250315&oos_search=false'
const targetPrice = 300

// Inner config
const PRICE_LABEL_SELECTOR =
  '#layoutPage > div.b6 > div.container.c > div.u3l_27.l7u_27.l9u_27 > div.n7n_27 > div > div > div.u3l_27.vl_27.l7u_27.u7l_27 > div.w0m_27.mw3_27 > div > div.mw1_27 > div > div > div.mt_27 > div.tm2_27.tm7_27 > div > div.t5m_27 > span.t3m_27.mt4_27.t7m_27'
const ADD_TO_CARTBTN_SELECTOR =
  '#layoutPage > div.b6 > div.container.c > div.u3l_27.l7u_27.l9u_27 > div.n7n_27 > div > div > div.u3l_27.vl_27.l7u_27.u7l_27 > div.w0m_27.mw3_27 > div > div.mw2_27 > div > div > div.w3k_27 > div > div > div > div.d4016-a.w1k_27 > button'
const BUY_NOW_BTN_SELECTOR =
  '#layoutPage > div.b6 > div.container.c > div.u3l_27.l7u_27.l9u_27 > div.n7n_27 > div > div > div.u3l_27.vl_27.l7u_27.lu9_27 > div.u3l_27.u7l_27 > button'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function startBot() {
  // Init standalone browser for testing
  // const browser = await puppeteer.launch({
  //   headless: false,
  //   width: 1600,
  //   height: 840,
  // })

  // Conncet to own browser
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222', width: 1600, height: 840 })

  const page = await browser.newPage()
  await page.setViewport({ width: 1600, height: 840 })
  await sleep(2000)

  //Go to ozon
  await page.goto('https://www.ozon.ru/')
  await sleep(2000)

  // Avoide antibot protection
  await saveClick(page, '#reload-button')
  await sleep(1000)

  await page.goto(linkToWatch)
  await sleep(2000)

  await page.screenshot({ path: 'screenshots/ozon-init.png' })

  getPrice(page)

  const timer = setInterval(async () => {
    console.log('run checking price task...')
    await page.reload()

    await simulateScrolling(page)

    let price = await getPrice(page)
    price = parseInt(price.replace(/\D/g, ''), 10)
    console.log(price)

    if (+price <= targetPrice) {
      await scrollTop(page)
      await page.screenshot({ path: 'screenshots/ozon-get-target-price.png' })

      console.log('Add to cart')
      await saveClick(page, ADD_TO_CARTBTN_SELECTOR)
      await sleep(800)

      console.log('Buy now')
      await saveClick(page, BUY_NOW_BTN_SELECTOR)
      await sleep(800)

      console.log('Clear Interval')
      clearInterval(timer)
    }
  }, 5000)

  //   await sleep(50000);
  //   await browser.close();
}

const getPrice = async (page) => {
  const priceElement = await page.waitForSelector(PRICE_LABEL_SELECTOR)
  const price = await priceElement?.evaluate((el) => el.textContent)
  console.log(`The current price is ${price}`)
  return price
}

const simulateScrolling = async (page) => {
  await page.evaluate(() => {
    window.scrollBy(0, 500)
  })
  await sleep(500)
  await page.evaluate(() => {
    window.scrollBy(0, 200)
  })
  await sleep(200)
  await page.evaluate(() => {
    window.scrollTo(0, 0)
  })
  await sleep(100)
}

const scrollTop = async (page) => {
  await page.evaluate(() => {
    window.scrollTo(0, 0)
  })
  await sleep(100)
}

const saveClick = async (page, selector) => {
  try {
    await page.click(selector)
  } catch (error) {
    console.log(`Not found selector: ${selector}`)
  }
}

startBot()
