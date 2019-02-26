// Libraries
import React, {PureComponent} from 'react'
import _ from 'lodash'

// Components
import {IconFont, ComponentColor} from '@influxdata/clockface'
import {ResourceList, Context} from 'src/clockface'
import FeatureFlag from 'src/shared/components/FeatureFlag'
import FetchLabels from 'src/shared/components/FetchLabels'
import ResourceLabels from 'src/shared/components/inline_label_editor/ResourceLabels'

// Types
import {Dashboard, Organization} from 'src/types/v2'
import {Label} from 'src/types/v2/labels'

// Constants
import {DEFAULT_DASHBOARD_NAME} from 'src/dashboards/constants'

interface Props {
  dashboard: Dashboard
  orgs: Organization[]
  onDeleteDashboard: (dashboard: Dashboard) => void
  onCloneDashboard: (dashboard: Dashboard) => void
  onExportDashboard: (dashboard: Dashboard) => void
  onUpdateDashboard: (dashboard: Dashboard) => void
  showOwnerColumn: boolean
  onRemoveLabels: (resourceID: string, labels: Label[]) => void
}

export default class DashboardCard extends PureComponent<Props> {
  public render() {
    const {dashboard} = this.props
    const {id} = dashboard

    return (
      <ResourceList.Card
        key={`dashboard-id--${id}`}
        testID="resource-card"
        name={() => (
          <ResourceList.Name
            onUpdate={this.handleUpdateDashboard}
            name={dashboard.name}
            hrefValue={`/dashboards/${dashboard.id}`}
            noNameString={DEFAULT_DASHBOARD_NAME}
            parentTestID="dashboard-card--name"
            buttonTestID="dashboard-card--name-button"
            inputTestID="dashboard-card--input"
          />
        )}
        description={() => (
          <ResourceList.Description
            onUpdate={this.handleUpdateDescription}
            description={dashboard.description}
            placeholder={`Describe ${dashboard.name}`}
          />
        )}
        labels={() => this.labels}
        updatedAt={dashboard.meta.updatedAt}
        owner={this.ownerOrg}
        contextMenu={() => this.contextMenu}
      />
    )
  }

  private handleUpdateDashboard = (name: string) => {
    this.props.onUpdateDashboard({...this.props.dashboard, name})
  }

  private handleRemoveLabels = (label: Label): void => {
    const {onRemoveLabels, dashboard} = this.props

    onRemoveLabels(dashboard.id, [label])
  }

  private get contextMenu(): JSX.Element {
    const {
      dashboard,
      onDeleteDashboard,
      onExportDashboard,
      onCloneDashboard,
    } = this.props

    return (
      <Context>
        <FeatureFlag>
          <Context.Menu icon={IconFont.CogThick}>
            <Context.Item
              label="Export"
              action={onExportDashboard}
              value={dashboard}
            />
          </Context.Menu>
        </FeatureFlag>
        <Context.Menu
          icon={IconFont.Duplicate}
          color={ComponentColor.Secondary}
        >
          <Context.Item
            label="Clone"
            action={onCloneDashboard}
            value={dashboard}
          />
        </Context.Menu>
        <Context.Menu
          icon={IconFont.Trash}
          color={ComponentColor.Danger}
          testID="context-delete-menu"
        >
          <Context.Item
            label="Delete"
            action={onDeleteDashboard}
            value={dashboard}
            testID="context-delete-dashboard"
          />
        </Context.Menu>
      </Context>
    )
  }

  private get labels(): JSX.Element {
    const {dashboard} = this.props

    return (
      <FetchLabels>
        {labels => (
          <ResourceLabels
            labels={labels}
            selectedLabels={dashboard.labels}
            onRemoveLabel={this.handleRemoveLabels}
          />
        )}
      </FetchLabels>
    )
  }

  private get ownerOrg(): Organization {
    const {dashboard, orgs} = this.props
    return orgs.find(o => o.id === dashboard.orgID)
  }

  private handleUpdateDescription = (description: string): void => {
    const {onUpdateDashboard} = this.props
    const dashboard = {...this.props.dashboard, description}

    onUpdateDashboard(dashboard)
  }
}