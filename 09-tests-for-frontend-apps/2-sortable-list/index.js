export default class SortableList {
  element

  constructor(items) {
    this.items = [...items.items]
    this.render()
    this.initEventListeners()
  }

  render() {
    const element = document.createElement("ul");
    element.classList.add('sortable-list')
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      item.classList.add('sortable-list__item')
      element.append(item)
    }
    this.element = element;
  }

  initEventListeners () {
    this.element.addEventListener('click', this.handleDelete)
    this.element.addEventListener('mousedown', this.handleDrag)
  }

  handleDelete = event => {
    const target = event.target.closest('[data-delete-handle]')
    if (target === null) return

    target.parentNode.remove()
  }

  handleDrag = event => {
    const target = event.target.closest('[data-grab-handle]')
    if (target === null) return

    const parent = target.parentNode
    const container = parent.parentNode

    const itemHeight = parent.clientHeight
    const containerHeight = container.clientHeight

    const containerTop = container.getBoundingClientRect().top
    const containerBottom = container.getBoundingClientRect().bottom

    const placeholder = document.createElement('div')
    placeholder.style.width = '100%'
    placeholder.style.height = `${itemHeight}px`
    placeholder.classList.add('sortable-list__placeholder')

    let shiftX = event.clientX - parent.getBoundingClientRect().left;
    let shiftY = event.clientY - parent.getBoundingClientRect().top;

    let indexArr = [0, 0]
    let index = Array.from([...container.children]).indexOf(parent);

    parent.classList.add('sortable-list__item_dragging')
    parent.style.width = '100%'
    this.element.append(parent);
    container.children[index].before(placeholder)
    moveAt(event.pageX, event.pageY);
  
    function moveAt(pageX, pageY) {
      parent.style.left = pageX - shiftX + 'px';
      parent.style.top = pageY - shiftY + 'px';
    }

    document.addEventListener('mousemove', onMouseMove);

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
      if (event.pageY < containerTop + itemHeight / 2) {
        container.prepend(placeholder)
      } else if (event.pageY > containerBottom - itemHeight / 2) {
        container.append(placeholder)
      } else {
        for (let i = containerTop; i < containerBottom; i += itemHeight) {
          if (event.pageY > i && event.pageY < (i + itemHeight)) {
            console.log(i);
            indexArr.push(i)
            indexArr.shift()
            if ((indexArr[0]) - (indexArr[1]) > 0) {
              index--
            } else if ((indexArr[0]) - (indexArr[1]) < 0) {
              index++
            }
            if (index < 1 || index > containerHeight / itemHeight - 2) return
            container.children[index].before(placeholder)
          }
        }
      }
    }

    parent.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      parent.onmouseup = null;
      placeholder.replaceWith(parent)
      parent.classList.remove('sortable-list__item_dragging')
      parent.style = null
    };
  }

  

  remove () {
    this.element?.remove()
  }

  destroy () {
    this.remove()
    this.element = null
  }
}