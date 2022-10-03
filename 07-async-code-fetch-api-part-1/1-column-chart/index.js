import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  element;
  chartHeight = 50;

  constructor ({url='', range={from, to}, label='', link='', formatHeading= data => data} = {}) {
    this.label = label
    this.link = link
    this.range = range
    this.formatHeading = formatHeading

    this.url = new URL(BACKEND_URL +'/'+ url)

    this.render()
    this.update(this.range.from, this.range.to)
  }

  render () {
    const element = document.createElement("div");
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
  }

  async fetchData (from, to) {
    this.url.searchParams.set('from', from)
    this.url.searchParams.set('to', to)

    const data = await fetchJson(this.url)
    return data
  }

  get template() {
    return `
      <div class="column-chart" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.link ? `<a href="/${this.link}" class="column-chart__link">View all</a>` : ''}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
          <div data-element="body" class="column-chart__chart"></div>
        </div>
    `;
  }

  dataTemplate (data) {
    const date = Object.keys(data)
    const values = Object.values(data)

    const maxData = Math.max(...values)
    const coef = 100 / maxData
    const dataTemplateArr = values.map(value => {
      value = value * coef
      const heightCol = Math.floor((this.chartHeight / 100) * value)
    
      return `<div style="--value: ${heightCol}" data-tooltip="${value.toFixed(0)}%"></div>`
    })
    return [...dataTemplateArr].join('')
  }

  async update (from, to) {
    this.element.classList.add('column-chart_loading');

    const data = await this.fetchData(from, to)
    const value = Object.values(data).reduce((a, b) => a+b, 0)

    const header = this.element.querySelector('[data-element="header"]')
    const chart = this.element.querySelector('[data-element="body"]')

    this.element.classList.remove('column-chart_loading');
    
    chart.innerHTML = this.dataTemplate(data)
    header.innerHTML = this.formatHeading(value)
  }

  remove () {
    this.element?.remove()
  }

  destroy () {
    this.remove()
    this.element = null
  }
}

