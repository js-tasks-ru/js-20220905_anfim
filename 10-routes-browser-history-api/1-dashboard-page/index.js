import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {
  element

  constructor() {
    this.to = new Date()
    
    this.from = new Date()
    this.from.setMonth(this.from.getMonth() - 1);

    this.BestsellersUrl = new URL(`${BACKEND_URL}api/dashboard/bestsellers`)
    this.BestsellersUrl.searchParams.set('from', this.from.toISOString())
    this.BestsellersUrl.searchParams.set('to', this.to.toISOString())
  }

  
  render() {
    const element = document.createElement("div");
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements()

    this.appendComponents()
    this.initEventListeners()

    this.subElements.progressBar.remove()
    return this.element
  }

  appendComponents() {
    this.setRangePicker()
    this.setColumnChart()
    this.setSortableTable()
  }

  updateComponents() {
    document.querySelector('main').prepend(this.subElements.progressBar)

    this.subElements.customersChart.innerHTML = ''
    this.subElements.ordersChart.innerHTML = ''
    this.subElements.salesChart.innerHTML = ''
    this.subElements.sortableTable.innerHTML = ''

    this.setColumnChart(this.from, this.to)

    this.BestsellersUrl.searchParams.set('from', this.from.toISOString())
    this.BestsellersUrl.searchParams.set('to', this.to.toISOString())
    
    this.setSortableTable(this.BestsellersUrl.pathname + this.BestsellersUrl.search)

    this.subElements.progressBar.remove()
  }

  setRangePicker() {
    const rangePicker = new RangePicker({from: this.from, to: this.to})
    this.subElements.rangePicker.append(rangePicker.element)
    this.rangePickerelem = rangePicker.element
  }

  setColumnChart(from = this.from, to = this.to) {
    const ordersChart = new ColumnChart({
      url: 'api/dashboard/orders',
      label: 'orders',
      range: {
        from: from,
        to: to
      },
      link: '#',
    })
    const salesChart = new ColumnChart({
      url: 'api/dashboard/sales',
      label: 'sales',
      range: {
        from: from,
        to: to
      },
      formatHeading: data => `${new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(data)}`,
    })
    const customersChart = new ColumnChart({
      url: 'api/dashboard/customers',
      label: 'customers',
      range: {
        from: from,
        to: to
      },
    })
    this.subElements.ordersChart.append(ordersChart.element)
    this.subElements.salesChart.append(salesChart.element)
    this.subElements.customersChart.append(customersChart.element)
  }

  setSortableTable(url = this.BestsellersUrl.pathname + this.BestsellersUrl.search) {
    const header = [
      {
        id: 'images',
        title: 'Image',
        sortable: false,
        template: (data = []) => {
          return `
            <div class="sortable-table__cell">
              <img class="sortable-table-image" alt="Image" src="${data[0]?.url}">
            </div>
          `;
        }
      },
      {
        id: 'title',
        title: 'Name',
        sortable: true,
        sortType: 'string'
      },
      {
        id: 'quantity',
        title: 'Quantity',
        sortable: true,
        sortType: 'number'
      },
      {
        id: 'price',
        title: 'Price',
        sortable: true,
        sortType: 'number'
      },
      {
        id: 'status',
        title: 'Status',
        sortable: true,
        sortType: 'number',
        template: data => {
          return `<div class="sortable-table__cell">
            ${data > 0 ? 'Active' : 'Inactive'}
          </div>`;
        }
      },
    ];
  
    const sortableTable = new SortableTable(header, {
      url: url,
      isSortLocally: true,
    });

    this.subElements.sortableTable.append(sortableTable.element)
  }

  initEventListeners() {
    document.addEventListener('date-select', this.dateSelectEvent)
  }

  dateSelectEvent = event => {
    this.from = event.detail.from
    this.to = event.detail.to
    this.updateComponents()
  }

  getSubElements() {
    const subElements = {}

    subElements.progressBar = document.querySelector('.progress-bar')
    
    subElements.rangePicker = this.element.querySelector('[data-element="rangePicker"]')
    subElements.ordersChart = this.element.querySelector('[data-element="ordersChart"]')
    subElements.salesChart = this.element.querySelector('[data-element="salesChart"]')
    subElements.customersChart = this.element.querySelector('[data-element="customersChart"]')
    subElements.sortableTable = this.element.querySelector('[data-element="sortableTable"]')

    // console.log(subElements)
    return subElements
  }

  get template() {
    return `
      <div class="dashboard">
        <div class="content__top-panel">
          <h2 class="page-title">Dashboard</h2>
          <div data-element="rangePicker"></div>
        </div>
        <div data-element="chartsRoot" class="dashboard__charts">
          <div data-element="ordersChart" class="dashboard__chart_orders"></div>
          <div data-element="salesChart" class="dashboard__chart_sales"></div>
          <div data-element="customersChart" class="dashboard__chart_customers"></div>
        </div>
        <h3 class="block-title">Best sellers</h3>
        <div data-element="sortableTable"></div>
      </div>
    `
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    document.removeEventListener('date-select', this.dateSelectEvent)
  }
}
