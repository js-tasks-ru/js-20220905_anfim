export default class DoubleSlider {
  element

  constructor() {
    this.render()
    this.initEventListeners()
  }

  render() {
    const element = document.createElement('div')
    element.classList.add('range-slider')
    element.innerHTML = this.template
    this.element = element

    this.valueElemStart = this.element.querySelector('[data-value="start"]')
    this.valueElemEnd = this.element.querySelector('[data-value="end"]')
    this.valueStart = parseInt(this.valueElemStart.textContent.replace('$', ''))
    this.valueEnd = parseInt(this.valueElemEnd.textContent.replace('$', ''))
    this.resultStart = this.valueStart
    this.resultEnd = this.valueEnd
  }

  get template() {
    return `
      <span data-value="start">$10</span>
      <div class="range-slider__inner">
        <span class="range-slider__progress"></span>
        <span class="range-slider__thumb-left"></span>
        <span class="range-slider__thumb-right"></span>
      </div>
      <span data-value="end">$100</span>
    `
  }

  initEventListeners() {
    this.element.addEventListener('mousedown', this.mouseDownHandler)
    document.addEventListener('range-select', this.rangeSelectEvent);
  }

  mouseDownHandler = event => {
    const target = event.target.closest('span')
    if (!target) return
    this.target = target
    this.progress = this.element.querySelector('.range-slider__progress')
    this.width = this.element.querySelector('.range-slider__inner').clientWidth
    
    this.shift = this.element.querySelector('.range-slider__inner').getBoundingClientRect().left
    
    document.addEventListener('mousemove', this.mouseMoveHandler)

    document.addEventListener('mouseup', this.mouseUpHandler)
  }

  mouseMoveHandler = event => {
    if (this.target.className === 'range-slider__thumb-left') {
      let percent = Math.floor(100 / (this.width / (event.clientX - this.shift)))
      percent = percent > 100 ? 100 : percent < 0 ? 0 : percent

      this.target.style.left = `${percent}%`
      this.progress.style.left = `${percent}%`

      this.resultStart = Math.floor(this.valueStart + (((this.valueEnd - this.valueStart) / 100) * percent))
      this.valueElemStart.innerHTML = `$${this.resultStart}`
    }
    if (this.target.className === 'range-slider__thumb-right') {
      let percent = Math.floor(100 / (this.width / (event.clientX - this.width - this.shift)) * -1)
      percent = percent > 100 ? 100 : percent < 0 ? 0 : percent
      
      this.target.style.right = `${percent}%`
      this.progress.style.right = `${percent}%`

      this.resultEnd = Math.floor(this.valueEnd - (((this.valueEnd - this.valueStart) / 100) * percent))
      this.valueElemEnd.innerHTML = `$${this.resultEnd}`
    }
  }

  mouseUpHandler = event => {
    document.removeEventListener('mousemove', this.mouseMoveHandler)
    document.dispatchEvent(new CustomEvent('range-select'));
  }

  rangeSelectEvent = event => {
    console.log('range is changed: ' + this.resultStart + '-' + this.resultEnd);
  }

  remove() {
    this.element?.remove()
  }

  destroy() {
    this.remove()
  }
}
