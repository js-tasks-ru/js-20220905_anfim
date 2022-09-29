export default class SortableTable {
  element
  subElements

  constructor(headerConfig, {
    data = [],
    sorted = {}
  } = {}) {
    this.headerConfig = headerConfig
    this.data = data
    this.sorted = sorted
    
    this.sortDirect = false
    this.isSortLocally = true
    this.headerRowsTemplate = this.headerRows()
    this.bodyRowsTemplate = this.bodyRows(this.sort(this.sorted.id, this.sorted.order))
    this.render()
    
    this.subElements = this.getSubElements()
    this.subElements.header.addEventListener('pointerdown', event => this.onSortedHandler(event), {bubbles: true})
  }
  
  render () {
    if (this.data.length) {
      const element = document.createElement("div");
      element.innerHTML = this.template;
      this.element = element.firstElementChild;
      
      const firstSortElem = this.element.children[0].children[0].querySelector(`[data-id="${this.sorted.id}"]`)

      const arrow = document.createElement("div");
      arrow.innerHTML = this.arrowTemp;
      this.arrow = arrow.firstElementChild;
      firstSortElem.dataset.order = 'asc'
      firstSortElem.appendChild(this.arrow)
    }
  }

  getSubElements() {
    const subElements = {}
    const elementsArr = this.element.querySelectorAll('[data-element]');
    
    elementsArr.forEach(elem => {
      subElements[elem.dataset.element] = elem
    })

    return subElements;
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

  get arrowTemp() {
    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `
  }

  sort (field, order) {
    let sortedArr = []
    if (this.isSortLocally) {
      sortedArr = this.sortOnClient(field, order);
    } else {
      sortedArr = this.sortOnServer(field, order);
    }
    return sortedArr
  }

  sortOnClient (field, order) {
    const index = this.headerConfig.findIndex(elem => elem.id === field)
    const targetCol = this.headerConfig[index]

    let compare = (a, b) => a - b;
    
    if (targetCol.sortType === 'string') {
      compare = (a, b) => a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'});
    }
    
    const sortedArr = [...this.data].sort((a, b) => {
      a = a[targetCol.id]
      b = b[targetCol.id]
      if (order === 'asc') {
        return compare (a, b)
      }
      if (order === 'desc') {
        return compare(b, a)
      }
      throw new Error('Wrong parameter direction')
    });

    return sortedArr
  }

  onSortedHandler (event) {
    let prevTarget = this.subElements.header.querySelector('[data-order]')
    let targetElem = event.target.closest('[data-sortable="true"]');

    if (targetElem !== prevTarget) {
      this.sortDirect = true
    }
    let order = this.sortDirect ? 'asc' : 'desc';

    [].forEach.call(this.subElements.header.children, function( el ) {
      el.removeAttribute('data-order');
    });
    this.subElements.body.innerHTML = this.bodyRows(this.sort(targetElem.dataset.id, order)).join('')
    targetElem.dataset.order = order
    targetElem.appendChild(this.arrow)

    this.sortDirect = !this.sortDirect
  }

  remove () {
    this.element?.remove()
  }

  destroy () {
    this.remove()
    this.subElements.header.removeEventListener('pointerdown', event => this.onSortedHandler(event), {bubbles: true})
    this.element = null
  }
}
