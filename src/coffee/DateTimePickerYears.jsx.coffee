###* @jsx React.DOM ###

`import React from './react-es6'`

DateTimePickerYears = React.createClass(

  propTypes:
    subtractDecade: React.PropTypes.func.isRequired
    addDecade: React.PropTypes.func.isRequired
    viewDate: React.PropTypes.object.isRequired
    selectedDate: React.PropTypes.object.isRequired
    setViewYear: React.PropTypes.func.isRequired

  renderYears: ->
    years = []
    year = parseInt(@props.viewDate.year() / 10, 10) * 10
    year--

    i = -1
    while i < 11
      classes =
        year: true
        old: i == -1 | i == 10
        active: @props.selectedDate.year() == year
      years.push `<span className={React.addons.classSet(classes)} onClick={this.props.setViewYear}>{year}</span>`
      year++
      i++

    years

  render: ->
    year = parseInt(@props.viewDate.year() / 10, 10) * 10

    `(
      <div className="datepicker-years" style={{display: "block"}}>
        <table className="table-condensed">
          <thead>
            <tr>
              <th className="prev" onClick={this.props.subtractDecade}>‹</th>

              <th className="switch" colSpan="5">{year} - {year+9}</th>

              <th className="next" onClick={this.props.addDecade}>›</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan="7">{this.renderYears()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )`

)

`export default = DateTimePickerYears`