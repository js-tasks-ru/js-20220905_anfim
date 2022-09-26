export default class ColumnChart {
  element;
  chartHeight = 50;

  constructor ({data=[], label='', value=0, link='', formatHeading= data => data} = {}) {
    this.data = data,
    this.label = label,
    this.value = value,
    this.link = link
    this.formatHeading = formatHeading

    this.render();
  }

  render () {
    const element = document.createElement("div");
    element.innerHTML = this.template;
    this.element = element.firstElementChild;

    if (this.data.length === 0) {
      this.element.classList.add('column-chart_loading')
    }
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
          <div data-element="body" class="column-chart__chart">
            ${this.dataTemplate()}
          </div>
        </div>
    `;
  }

  dataTemplate (data = this.data) {
    const maxData = Math.max(...data)
    const coef = 100 / maxData
    const dataTemplateArr = data.map(value => {
      value = value * coef
      const heightCol = Math.floor((this.chartHeight / 100) * value)

      return `<div style="--value: ${heightCol}" data-tooltip="${value.toFixed(0)}%"></div>`
    })
    return [...dataTemplateArr].join('')
  }

  update (data = this.data, value = this.value) {
    // const currentChart = this.element.children[1]
    const header = this.element.querySelector('[data-element="header"]')
    const chart = this.element.querySelector('[data-element="body"]')

    if (data.length === 0) {
      this.element.classList.add('column-chart_loading')
    } else {
      chart.innerHTML = this.dataTemplate(data)
      header.innerHTML = value
    }
  }

  remove () {
    this.element?.remove()
  }

  destroy () {
    this.remove()
    this.element = null
  }
}