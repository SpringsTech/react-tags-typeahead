import React from 'react'
import ReactDOM from 'react-dom'
import ReactTags from '../lib/ReactTags'
import suggestions from './countries'

class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      tags: [
        { id: 184, name: 'Thailand' },
        { id: 86, name: 'India' }
      ],
      suggestions
    }

    this.reactTags = React.createRef()
  }

  onDelete (i) {
    const tags = this.state.tags.slice(0)
    tags.splice(i, 1)
    this.setState({ tags })
  }

  onAddition (tag) {
    const tags = [].concat(this.state.tags, tag)
    this.setState({ tags })
  }

  render () {
    return (
      <>
        <p>Select the countries you have visited using React Tags below:</p>
        <ReactTags
          ref={this.reactTags}
          tags={this.state.tags}
          minQueryLength={0}
          suggestions={this.state.suggestions}
          onDelete={this.onDelete.bind(this)}
          onAddition={this.onAddition.bind(this)}
        />
        <p>Output:</p>
        <pre><code>{JSON.stringify(this.state.tags, null, 2)}</code></pre>
      </>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
