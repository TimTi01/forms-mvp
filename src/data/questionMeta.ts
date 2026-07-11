import type { SvgIconComponent } from '@mui/icons-material'
import StraightenIcon from '@mui/icons-material/Straighten'
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize'
import PaletteIcon from '@mui/icons-material/Palette'
import CountertopsIcon from '@mui/icons-material/Countertops'
import HandymanIcon from '@mui/icons-material/Handyman'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import ExtensionIcon from '@mui/icons-material/Extension'
import MicrowaveIcon from '@mui/icons-material/Microwave'
import PersonIcon from '@mui/icons-material/Person'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ViewWeekIcon from '@mui/icons-material/ViewWeek'
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt'
import KitchenIcon from '@mui/icons-material/Kitchen'

export interface QuestionMeta {
  icon: SvgIconComponent
  hint: string
  previewFocus: 'size' | 'layout' | 'facade' | 'countertop' | 'hardware' | 'modules' | 'extras' | 'appliances' | 'overview'
}

export const QUESTION_META: Record<string, QuestionMeta> = {
  length: {
    icon: StraightenIcon,
    hint: 'Укажите длину стены, вдоль которой планируется кухня',
    previewFocus: 'size',
  },
  layout: {
    icon: DashboardCustomizeIcon,
    hint: 'Линейная, угловая (Г), двухрядная, П-образная, с островом или полуостровом',
    previewFocus: 'layout',
  },
  facade: {
    icon: PaletteIcon,
    hint: 'Цвет и фактура фасадов меняют внешний вид кухни',
    previewFocus: 'facade',
  },
  countertop: {
    icon: CountertopsIcon,
    hint: 'Столешница — главный акцент рабочей зоны',
    previewFocus: 'countertop',
  },
  hardware: {
    icon: HandymanIcon,
    hint: 'Фурнитура влияет на плавность открывания и срок службы',
    previewFocus: 'hardware',
  },
  modules: {
    icon: ViewModuleIcon,
    hint: 'Больше модулей — больше шкафов и ящиков',
    previewFocus: 'modules',
  },
  nonStandard: {
    icon: ExtensionIcon,
    hint: 'Нестандартные элементы: колонны, радиусы, витрины',
    previewFocus: 'extras',
  },
  appliances: {
    icon: MicrowaveIcon,
    hint: 'Встроенная техника экономит место и выглядит цельно',
    previewFocus: 'appliances',
  },
}

export const PHASE_META = {
  form: { icon: PersonIcon, hint: 'Оставьте контакты — расчёт уже готов' },
  success: { icon: CheckCircleIcon, hint: 'Заявка принята' },
}

export function getOptionIcon(questionId: string, value: string): SvgIconComponent | null {
  const icons: Record<string, Record<string, SvgIconComponent>> = {
    layout: {
      linear: StraightenIcon,
      corner: DashboardCustomizeIcon,
      galley: ViewWeekIcon,
      u_shape: ViewQuiltIcon,
      island: KitchenIcon,
    },
    facade: {
      ldsp: PaletteIcon,
      mdf_paint: PaletteIcon,
      mdf_film: PaletteIcon,
      acrylic: PaletteIcon,
    },
    countertop: {
      ldsp: CountertopsIcon,
      stone: CountertopsIcon,
      quartz: CountertopsIcon,
    },
    hardware: {
      basic: HandymanIcon,
      standard: HandymanIcon,
      premium: HandymanIcon,
    },
    nonStandard: {
      none: ExtensionIcon,
      few: ExtensionIcon,
      many: ExtensionIcon,
    },
    appliances: {
      none: MicrowaveIcon,
      basic: MicrowaveIcon,
      full: MicrowaveIcon,
    },
  }
  return icons[questionId]?.[value] ?? null
}
