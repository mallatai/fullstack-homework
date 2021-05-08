import { PureComponent } from 'react'
import { sortBy, find } from 'lodash'

import CropSelect from './CropSelect'
import { Crop, Field, SeasonalCrop, HumusBalanceData } from './types'
import { fetchCrops, fetchFields, calculateHumusBalance } from './api'
import buildNewFieldsState from './buildNewFieldsState'

type Props = {}

type State = {
  allCrops: Array<Crop>,
  fields: Array<Field>,
  humusBalance: Array<HumusBalanceData>
}

export default class Table extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      allCrops: [],
      fields: [],
      humusBalance: [],
    }
  }

  componentDidMount = async () =>
    this.setState({
      fields: await fetchFields(),
      allCrops: await fetchCrops(),
    })

  async componentDidUpdate(_prevProps: Props, prevState: State) {
    if (prevState.fields !== this.state.fields) {
      let humusBalance = await calculateHumusBalance(this.state.fields)
      // A hack to match the fields order
      let sorted = sortBy(humusBalance, e => e.field_name)
      this.setState({humusBalance: sorted})
    }
  }

  render = () =>
    <div className="table">
      <div className="table__row table__row--header">
        <div className="table__cell">Field name</div>
        <div className="table__cell table__cell--right">Field area (ha)</div>
        <div className="table__cell table__cell--center">2020 crop</div>
        <div className="table__cell table__cell--center">2021 crop</div>
        <div className="table__cell table__cell--center">2022 crop</div>
        <div className="table__cell table__cell--center">2023 crop</div>
        <div className="table__cell table__cell--center">2024 crop</div>
        <div className="table__cell table__cell--right">Humus balance</div>
      </div>

      {sortBy(this.state.fields, field => field.name).map(field => this.renderFieldRow(field))}
    </div>

  renderFieldRow = (field: Field) =>
    <div className="table__row" key={field.id}>
      <div className="table__cell">{field.name}</div>
      <div className="table__cell table__cell--right">{field.area}</div>

      {sortBy(field.crops, crop => crop.year).map(seasonalCrop => this.renderCropCell(field, seasonalCrop))}

      <div className="table__cell table__cell--right">
        {find(this.state.humusBalance, b => b.field_id === field.id)?.humus_balance}
      </div>
    </div>

  renderCropCell = (field: Field, seasonalCrop: SeasonalCrop) =>
    <div className="table__cell table__cell--center table__cell--with-select">
      <CropSelect
        selectedCrop={seasonalCrop.crop}
        allCrops={this.state.allCrops}
        onChange={newCrop => this.changeFieldCrop(newCrop, field.id, seasonalCrop.year)}
      />
    </div>

  changeFieldCrop = (newCrop: Crop | null, fieldId: number, cropYear: number) =>
    this.setState(
      buildNewFieldsState(this.state.fields, newCrop, fieldId, cropYear),
    )
}
