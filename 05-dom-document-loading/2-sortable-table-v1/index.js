export default class SortableTable {
  element
  subElements = {}

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig
    this.data = data

    this.headerRowsTemplate = this.headerRows()
    this.bodyRowsTemplate = this.bodyRows()
    this.render()
    this.subElements = this.getSubElements()
  }

  render () {
    if (this.data.length) {
      const element = document.createElement("div");
      element.innerHTML = this.template;
      this.element = element.firstElementChild;
    }
  }

  headerRows () {
    return this.headerConfig.map(elem => {
        return `
          <div class="sortable-table__cell" data-id="${elem.id}" data-sortable="${elem.sortable}">
            <span>${elem.title}</span>
          </div>
        `
      })
  }

  bodyRows (data = this.data) {
    return data.map(elem => {
        return `
          <a href="/products/${elem.id}" class="sortable-table__row">
            ${Object.values(this.headerConfig).map(field => {
              if (field.template) {
                return field.template(elem[field.id])
              } else {
                return `<div class="sortable-table__cell">${elem[field.id]}</div>`
              }
              }).join('')
            }
          </a>
        `
    })
  }

  get template() {
    return `
    <div data-element="productsContainer" class="products-list__container">
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.headerRowsTemplate.join('')}
        </div>
        <div data-element="body" class="sortable-table__body">
          ${this.bodyRowsTemplate.join('')}
        </div>
      </div>
    </div>
    `
  }

  getSubElements() {
    const subElements = {}
    const elementsArr = this.element.querySelectorAll('[data-element]');
    
    elementsArr.forEach(elem => {
      subElements[elem.dataset.element] = elem
    })

    return subElements;
  }

  sort (fieldValue, orderValue) {
    const index = this.headerConfig.findIndex(elem => elem.id === fieldValue)
    const targetCol = this.headerConfig[index]

    let compare = (a, b) => a - b;
    
    if (targetCol.sortType === 'string') {
      compare = (a, b) => a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'});
    }
    
    const sortedArr = [...this.data].sort((a, b) => {
      a = a[targetCol.id]
      b = b[targetCol.id]
      if (orderValue === 'asc') {
        return compare (a, b)
      }
      if (orderValue === 'desc') {
        return compare(b, a)
      }
      throw new Error('Wrong parameter direction')
    });
    this.bodyRowsTemplate = this.bodyRows(sortedArr)
    this.subElements.body.innerHTML = this.bodyRowsTemplate.join('')
    
    this.subElements.header.children[index].dataset.order = orderValue //атрибуты добавляю, но не разобрался как их удалять

    this.subElements = this.bodyRows(sortedArr).join('')
  }

  remove () {
    this.element?.remove()
  }

  destroy () {
    this.remove()
    this.element = null
  }
}
