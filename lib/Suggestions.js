import React from 'react'
import { matchAny } from './concerns/matchers'

function markIt (name, query) {
  const regexp = matchAny(query)
  return name.replace(regexp, '<mark>$&</mark>')
}

const DefaultSuggestionComponent = ({ item, query }) => (
  <span dangerouslySetInnerHTML={{ __html: markIt(item.name, query) }} />
)

// Taken from https://stackoverflow.com/a/37285344
function ensureInView(container, element) {
  //Determine container top and bottom
  let cTop = container.scrollTop;
  let cBottom = cTop + container.clientHeight;

  //Determine element top and bottom
  let eTop = element.offsetTop;
  let eBottom = eTop + element.clientHeight;

  //Check if out of view
  if (eTop < cTop) {
    container.scrollTop -= (cTop - eTop);
  }
  else if (eBottom > cBottom) {
    container.scrollTop += (eBottom - cBottom);
  }
}

function findChildByClassName(parent, className) {
  const classRegExp = RegExp('\\b' + className + '\\b');

  for (var i = 0; i < parent.childNodes.length; i++) {
      if (classRegExp.test(parent.childNodes[i].className)) {
        return parent.childNodes[i];
      }
  }

  return undefined;
}

class Suggestions extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  onMouseDown (item, e) {
    // focus is shifted on mouse down but calling preventDefault prevents this
    e.preventDefault()
    this.props.addTag(item)
  }

  ensureActiveItemVisible() {
    if (!this.listRef.current) {
      return;
    }

    const activeElement = findChildByClassName(this.listRef.current, this.props.classNames.suggestionActive);
    if (!activeElement) {
      return;
    }

    ensureInView(this.listRef.current, activeElement);
  }

  componentDidUpdate() {
    this.ensureActiveItemVisible();
  }

  render () {
    if (!this.props.expanded || !this.props.options.length) {
      return null
    }

    const SuggestionComponent = this.props.suggestionComponent || DefaultSuggestionComponent

    const options = this.props.options.map((item, index) => {
      const key = `${this.props.id}-${index}`
      const classNames = []

      if (this.props.index === index) {
        classNames.push(this.props.classNames.suggestionActive)
      }

      if (item.disabled) {
        classNames.push(this.props.classNames.suggestionDisabled)
      }

      return (
        <li
          id={key}
          key={key}
          role='option'
          className={classNames.join(' ')}
          aria-disabled={item.disabled === true}
          onMouseDown={this.onMouseDown.bind(this, item)}
        >
          {item.disableMarkIt ? item.name
            : <SuggestionComponent item={item} query={this.props.query} />}
        </li>
      )
    })

    return (
      <div className={this.props.classNames.suggestions}>
        <ul role='listbox' id={this.props.id} ref={this.listRef}>{options}</ul>
      </div>
    )
  }
}

export default Suggestions
