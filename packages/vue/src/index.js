/*
 * ADION UI - le kit d'Adion Cloud pour Vue 3 et Vuetify. Une seule source :
 * aucune app ne cree de composant, elle importe d'ici.
 *
 *   import '@myadion/tokens/tokens.css'
 *   import '@myadion/ui/ui.css'
 *   import { createAdionUi, UiListLayout, UiTable, UiBadge } from '@myadion/ui'
 */

export { createAdionUi, useAdion } from './adapter.js'

// Gabarits de page
export { default as UiListLayout } from './UiListLayout.vue'
export { default as UiDetailLayout } from './UiDetailLayout.vue'
export { default as UiWizardLayout } from './UiWizardLayout.vue'
export { default as UiFormLayout } from './UiFormLayout.vue'
export { default as UiHomeLayout } from './UiHomeLayout.vue'

// Page
export { default as UiPage } from './UiPage.vue'
export { default as UiPageHeader } from './UiPageHeader.vue'
export { default as UiTabs } from './UiTabs.vue'
export { default as UiSubTabs } from './UiSubTabs.vue'
export { default as UiSection } from './UiSection.vue'
export { default as UiCard } from './UiCard.vue'
export { default as UiStat } from './UiStat.vue'

// Listes
export { default as UiTable } from './UiTable.vue'
export { default as UiServiceTable } from './UiServiceTable.vue'
export { SERVICE_COLUMNS, serviceRow } from './serviceTable'
export { default as UiToolbar } from './UiToolbar.vue'
export { default as UiActionMenu } from './UiActionMenu.vue'
export { default as UiServiceActions } from './UiServiceActions.vue'

// Formulaires
export { default as UiForm } from './UiForm.vue'
export { default as UiField } from './UiField.vue'
export { default as UiInput } from './UiInput.vue'
export { default as UiSelect } from './UiSelect.vue'
export { default as UiCombobox } from './UiCombobox.vue'
export { default as UiCheckbox } from './UiCheckbox.vue'
export { default as UiChoices } from './UiChoices.vue'
export { default as UiSegmented } from './UiSegmented.vue'
export { default as UiAddress } from './UiAddress.vue'
export { default as UiTagsInput } from './UiTagsInput.vue'
export { default as UiColumnMapper } from './UiColumnMapper.vue'
export { default as UiChannelChip } from './UiChannelChip.vue'
export { default as UiFileInput } from './UiFileInput.vue'
export { default as UiWizard } from './UiWizard.vue'

export { default as UiSortableList } from './UiSortableList.vue'
export { default as UiMeter } from './UiMeter.vue'

// Resultats et controles (2026-10-15)
export { default as UiLineChart } from './UiLineChart.vue'
export { default as UiBarChart } from './UiBarChart.vue'
export { default as UiChecklist } from './UiChecklist.vue'

// Fenetres et actions
export { default as UiDialog } from './UiDialog.vue'
export { default as UiConfirm } from './UiConfirm.vue'
export { default as UiButton } from './UiButton.vue'

// Etats
export { default as UiBadge } from './UiBadge.vue'
export { default as UiStatus } from './UiStatus.vue'
export { default as UiNotice } from './UiNotice.vue'
export { default as UiSandboxBanner } from './UiSandboxBanner.vue'
export { default as UiEmpty } from './UiEmpty.vue'
export { default as UiLoading } from './UiLoading.vue'
export { default as UiError } from './UiError.vue'
export { default as UiDenied } from './UiDenied.vue'

// Contenus
export { default as UiKeyValue } from './UiKeyValue.vue'
export { default as UiTimeline } from './UiTimeline.vue'
export { default as UiActivity } from './UiActivity.vue'
export { default as UiPromoCard } from './UiPromoCard.vue'
export { default as UiLinkList } from './UiLinkList.vue'
export { default as UiDrawer } from './UiDrawer.vue'
export { default as UiSlider } from './UiSlider.vue'
export { default as UiCommandPalette } from './UiCommandPalette.vue'
export { default as UiHelpMenu } from './UiHelpMenu.vue'
export { default as UiIdentifierInput } from './UiIdentifierInput.vue'
export { default as UiSplitLayout } from './UiSplitLayout.vue'
export { default as UiDateInput } from './UiDateInput.vue'
export { default as UiCountrySelect } from './UiCountrySelect.vue'
export { default as UiWelcome } from './UiWelcome.vue'
export { default as UiAccountPicker } from './UiAccountPicker.vue'
export { default as UiPasskeyList } from './UiPasskeyList.vue'
export { default as UiSignedInBadge } from './UiSignedInBadge.vue'
export { default as UiFlag } from './UiFlag.vue'
export { default as UiAppMark } from './UiAppMark.vue'
export { default as UiStickyBar } from './UiStickyBar.vue'
export { default as UiEditableLabel } from './UiEditableLabel.vue'
export { default as UiFloat } from './UiFloat.vue'
export { default as UiConversation } from './UiConversation.vue'
export { default as UiStaffBanner } from './UiStaffBanner.vue'
export { default as UiServiceTree } from './UiServiceTree.vue'
export { default as UiSimCard } from './UiSimCard.vue'
export { default as UiMedia } from './UiMedia.vue'
export { printTable } from './printTable.js'
export { identifierKindOf } from './identifier.js'
export { default as UiList } from './UiList.vue'
export { default as UiCode } from './UiCode.vue'
export { default as UiSecret } from './UiSecret.vue'
export { default as UiCopyId } from './UiCopyId.vue'
export { default as UiMessagePreview } from './UiMessagePreview.vue'
export { default as UiUnicodeNotice } from './UiUnicodeNotice.vue'
export { default as UiOrderBlock } from './UiOrderBlock.vue'

// Pages qui donnent envie
export { default as UiHero } from './UiHero.vue'
export { default as UiFeatureGrid } from './UiFeatureGrid.vue'
export { default as UiChoiceCards } from './UiChoiceCards.vue'
export { default as UiSetup } from './UiSetup.vue'
export { default as UiCopyCallout } from './UiCopyCallout.vue'
export { default as UiPromptList } from './UiPromptList.vue'

// Les courriels : l'editeur visuel (2026-10-14)
export { default as UiMailStudio } from './UiMailStudio.vue'
export { default as UiMailCanvas } from './UiMailCanvas.vue'
export { default as UiMailBlockSettings } from './UiMailBlockSettings.vue'
export { default as UiMailBlockMenu } from './UiMailBlockMenu.vue'
export { default as UiMailAlignPicker } from './UiMailAlignPicker.vue'
export { default as UiMailTemplatePicker } from './UiMailTemplatePicker.vue'
export { default as UiMailThumbnail } from './UiMailThumbnail.vue'
export { default as UiMailGallery } from './UiMailGallery.vue'
export { default as UiColorInput } from './UiColorInput.vue'
// L'editeur riche, Mes images et la galerie des modeles (2026-10-15)
export { default as UiMailStyleFields } from './UiMailStyleFields.vue'
export { default as UiMailDropZone } from './UiMailDropZone.vue'
export { default as UiMailImageLibrary } from './UiMailImageLibrary.vue'
export { default as UiMailTemplateGallery } from './UiMailTemplateGallery.vue'

export { tone, toneOf } from './tone'
export { default as UiPublicLayout } from './UiPublicLayout.vue'
// La coque d'une application : barre de gauche, barre du haut, page (2026-10-28)
export { default as UiAppShell } from './UiAppShell.vue'
export { default as UiTopBar } from './UiTopBar.vue'
export { default as UiIconActions } from './UiIconActions.vue'
// La barre de gauche (2026-10-28)
export { default as UiSidebar } from './UiSidebar.vue'
export { default as UiSidebarContext } from './UiSidebarContext.vue'
export { default as UiSidebarModes } from './UiSidebarModes.vue'
export { default as UiSidebarSearch } from './UiSidebarSearch.vue'
export { default as UiSidebarSection } from './UiSidebarSection.vue'
export { default as UiSidebarProduct } from './UiSidebarProduct.vue'
export { default as UiSidebarEntry } from './UiSidebarEntry.vue'
export { default as UiSidebarEmpty } from './UiSidebarEmpty.vue'
export { default as UiSidebarFooter } from './UiSidebarFooter.vue'
export { default as UiSidebarLink } from './UiSidebarLink.vue'
export { default as UiSidebarChild } from './UiSidebarChild.vue'
export { default as UiCard3D } from './UiCard3D.vue'
export { default as UiCardField } from './UiCardField.vue'
export { unicodeChars, unicodeFacts } from './unicode'
export { default as UiServiceNotice } from './UiServiceNotice.vue'
export { healthOf, overallText, uptimeText, uptimeTone, historyStrip, measuredText, groupDisruptions } from './health'
export { default as UiHealthGroup } from './UiHealthGroup.vue'

// Le centre de notifications
export { default as UiAssistantButton } from './UiAssistantButton.vue'
export { default as UiNotificationBell } from './UiNotificationBell.vue'
export { default as UiNotificationDrawer } from './UiNotificationDrawer.vue'
export { default as UiNotificationCenter } from './UiNotificationCenter.vue'

// L'assistant, second onglet du volet
export { default as UiAssistantPanel } from './UiAssistantPanel.vue'
export { default as UiAssistantMessage } from './UiAssistantMessage.vue'
export { default as UiAssistantConfirmCard } from './UiAssistantConfirmCard.vue'
export { default as UiAssistantLimit } from './UiAssistantLimit.vue'
