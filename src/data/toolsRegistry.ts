import React, { lazy } from 'react';
import { ToolItem, ToolCategory } from '../types';
import { TEMPLATES_DATA } from './templatesData';
import { createTemplateComponent } from '../components/templates/TemplateRunner';
import { WEB_TOOLS_REGISTRY } from './webToolsRegistry';
import { MEDIA_TOOLS_REGISTRY } from './mediaToolsRegistry';
import { COMMUNICATION_TOOLS_REGISTRY } from './communicationToolsRegistry';
import { HEALTH_TOOLS_REGISTRY } from './healthToolsRegistry';
import { TRAVEL_TOOLS_REGISTRY } from './travelToolsRegistry';
import { HOUSEHOLD_TOOLS_REGISTRY } from './householdToolsRegistry';

// Lazy loaded components for optimized bundle splitting
// Category A: Calculators
const AgeCalculator = lazy(() => import('../components/tools/calculators/AgeCalculator').then(m => ({ default: m.AgeCalculator })));
const DateDifferenceCalculator = lazy(() => import('../components/tools/calculators/DateDifferenceCalculator').then(m => ({ default: m.DateDifferenceCalculator })));
const DaysBetweenDates = lazy(() => import('../components/tools/calculators/DaysBetweenDates').then(m => ({ default: m.DaysBetweenDates })));
const PercentageCalculator = lazy(() => import('../components/tools/calculators/PercentageCalculator').then(m => ({ default: m.PercentageCalculator })));
const DiscountCalculator = lazy(() => import('../components/tools/calculators/DiscountCalculator').then(m => ({ default: m.DiscountCalculator })));
const GstCalculator = lazy(() => import('../components/tools/calculators/GstCalculator').then(m => ({ default: m.GstCalculator })));
const EmiCalculator = lazy(() => import('../components/tools/calculators/EmiCalculator').then(m => ({ default: m.EmiCalculator })));
const LoanCalculator = lazy(() => import('../components/tools/calculators/LoanCalculator').then(m => ({ default: m.LoanCalculator })));
const SimpleInterestCalculator = lazy(() => import('../components/tools/calculators/SimpleInterestCalculator').then(m => ({ default: m.SimpleInterestCalculator })));
const CompoundInterestCalculator = lazy(() => import('../components/tools/calculators/CompoundInterestCalculator').then(m => ({ default: m.CompoundInterestCalculator })));
const SalaryCalculator = lazy(() => import('../components/tools/calculators/SalaryCalculator').then(m => ({ default: m.SalaryCalculator })));
const ProfitLossCalculator = lazy(() => import('../components/tools/calculators/ProfitLossCalculator').then(m => ({ default: m.ProfitLossCalculator })));
const ElectricityBillCalculator = lazy(() => import('../components/tools/calculators/ElectricityBillCalculator').then(m => ({ default: m.ElectricityBillCalculator })));
const FuelCostCalculator = lazy(() => import('../components/tools/calculators/FuelCostCalculator').then(m => ({ default: m.FuelCostCalculator })));
const TipCalculator = lazy(() => import('../components/tools/calculators/TipCalculator').then(m => ({ default: m.TipCalculator })));
const SplitBillCalculator = lazy(() => import('../components/tools/calculators/SplitBillCalculator').then(m => ({ default: m.SplitBillCalculator })));
const TimeDurationCalculator = lazy(() => import('../components/tools/calculators/TimeDurationCalculator').then(m => ({ default: m.TimeDurationCalculator })));
const WorkingDaysCalculator = lazy(() => import('../components/tools/calculators/WorkingDaysCalculator').then(m => ({ default: m.WorkingDaysCalculator })));
const AverageCalculator = lazy(() => import('../components/tools/calculators/AverageCalculator').then(m => ({ default: m.AverageCalculator })));
const RatioCalculator = lazy(() => import('../components/tools/calculators/RatioCalculator').then(m => ({ default: m.RatioCalculator })));
const FractionCalculator = lazy(() => import('../components/tools/calculators/FractionCalculator').then(m => ({ default: m.FractionCalculator })));
const BmiCalculator = lazy(() => import('../components/tools/calculators/BmiCalculator').then(m => ({ default: m.BmiCalculator })));
const CalorieCalculator = lazy(() => import('../components/tools/calculators/CalorieCalculator').then(m => ({ default: m.CalorieCalculator })));
const SpeedCalculator = lazy(() => import('../components/tools/calculators/SpeedCalculator').then(m => ({ default: m.SpeedCalculator })));

// Category B: Converters
const LengthConverter = lazy(() => import('../components/tools/converters/LengthConverter').then(m => ({ default: m.LengthConverter })));
const WeightConverter = lazy(() => import('../components/tools/converters/WeightConverter').then(m => ({ default: m.WeightConverter })));
const TemperatureConverter = lazy(() => import('../components/tools/converters/TemperatureConverter').then(m => ({ default: m.TemperatureConverter })));
const AreaConverter = lazy(() => import('../components/tools/converters/AreaConverter').then(m => ({ default: m.AreaConverter })));
const VolumeConverter = lazy(() => import('../components/tools/converters/VolumeConverter').then(m => ({ default: m.VolumeConverter })));
const SpeedConverter = lazy(() => import('../components/tools/converters/SpeedConverter').then(m => ({ default: m.SpeedConverter })));
const TimeConverter = lazy(() => import('../components/tools/converters/TimeConverter').then(m => ({ default: m.TimeConverter })));
const DataStorageConverter = lazy(() => import('../components/tools/converters/DataStorageConverter').then(m => ({ default: m.DataStorageConverter })));
const EnergyConverter = lazy(() => import('../components/tools/converters/EnergyConverter').then(m => ({ default: m.EnergyConverter })));
const PressureConverter = lazy(() => import('../components/tools/converters/PressureConverter').then(m => ({ default: m.PressureConverter })));
const PowerConverter = lazy(() => import('../components/tools/converters/PowerConverter').then(m => ({ default: m.PowerConverter })));
const AngleConverter = lazy(() => import('../components/tools/converters/AngleConverter').then(m => ({ default: m.AngleConverter })));
const NumberSystemConverter = lazy(() => import('../components/tools/converters/NumberSystemConverter').then(m => ({ default: m.NumberSystemConverter })));
const RomanNumeralConverter = lazy(() => import('../components/tools/converters/RomanNumeralConverter').then(m => ({ default: m.RomanNumeralConverter })));
const CookingMeasurementConverter = lazy(() => import('../components/tools/converters/CookingMeasurementConverter').then(m => ({ default: m.CookingMeasurementConverter })));

// Category C: Text Tools
const WordCounter = lazy(() => import('../components/tools/text/WordCounter').then(m => ({ default: m.WordCounter })));
const CharacterCounter = lazy(() => import('../components/tools/text/CharacterCounter').then(m => ({ default: m.CharacterCounter })));
const SentenceCounter = lazy(() => import('../components/tools/text/SentenceCounter').then(m => ({ default: m.SentenceCounter })));
const CaseConverter = lazy(() => import('../components/tools/text/CaseConverter').then(m => ({ default: m.CaseConverter })));
const UppercaseConverter = lazy(() => import('../components/tools/text/UppercaseConverter').then(m => ({ default: m.UppercaseConverter })));
const LowercaseConverter = lazy(() => import('../components/tools/text/LowercaseConverter').then(m => ({ default: m.LowercaseConverter })));
const TitleCaseConverter = lazy(() => import('../components/tools/text/TitleCaseConverter').then(m => ({ default: m.TitleCaseConverter })));
const RemoveDuplicateLines = lazy(() => import('../components/tools/text/RemoveDuplicateLines').then(m => ({ default: m.RemoveDuplicateLines })));
const RemoveExtraSpaces = lazy(() => import('../components/tools/text/RemoveExtraSpaces').then(m => ({ default: m.RemoveExtraSpaces })));
const TextSorter = lazy(() => import('../components/tools/text/TextSorter').then(m => ({ default: m.TextSorter })));
const TextReverser = lazy(() => import('../components/tools/text/TextReverser').then(m => ({ default: m.TextReverser })));
const FindAndReplace = lazy(() => import('../components/tools/text/FindAndReplace').then(m => ({ default: m.FindAndReplace })));
const TextDiffChecker = lazy(() => import('../components/tools/text/TextDiffChecker').then(m => ({ default: m.TextDiffChecker })));
const LineCounter = lazy(() => import('../components/tools/text/LineCounter').then(m => ({ default: m.LineCounter })));
const SlugGenerator = lazy(() => import('../components/tools/text/SlugGenerator').then(m => ({ default: m.SlugGenerator })));
const LoremIpsumGenerator = lazy(() => import('../components/tools/text/LoremIpsumGenerator').then(m => ({ default: m.LoremIpsumGenerator })));
const TextCleaner = lazy(() => import('../components/tools/text/TextCleaner').then(m => ({ default: m.TextCleaner })));
const MarkdownEditor = lazy(() => import('../components/tools/text/MarkdownEditor').then(m => ({ default: m.MarkdownEditor })));
const HtmlToText = lazy(() => import('../components/tools/text/HtmlToText').then(m => ({ default: m.HtmlToText })));
const TextToHtml = lazy(() => import('../components/tools/text/TextToHtml').then(m => ({ default: m.TextToHtml })));
const LineBreakRemover = lazy(() => import('../components/tools/text/LineBreakRemover').then(m => ({ default: m.LineBreakRemover })));
const DuplicateWordRemover = lazy(() => import('../components/tools/text/DuplicateWordRemover').then(m => ({ default: m.DuplicateWordRemover })));

// Category D: Developer Tools
const JsonFormatter = lazy(() => import('../components/tools/developer/JsonFormatter').then(m => ({ default: m.JsonFormatter })));
const JsonValidator = lazy(() => import('../components/tools/developer/JsonValidator').then(m => ({ default: m.JsonValidator })));
const JsonMinifier = lazy(() => import('../components/tools/developer/JsonMinifier').then(m => ({ default: m.JsonMinifier })));
const XmlFormatter = lazy(() => import('../components/tools/developer/XmlFormatter').then(m => ({ default: m.XmlFormatter })));
const XmlValidator = lazy(() => import('../components/tools/developer/XmlValidator').then(m => ({ default: m.XmlValidator })));
const HtmlFormatter = lazy(() => import('../components/tools/developer/HtmlFormatter').then(m => ({ default: m.HtmlFormatter })));
const CssFormatter = lazy(() => import('../components/tools/developer/CssFormatter').then(m => ({ default: m.CssFormatter })));
const JavascriptFormatter = lazy(() => import('../components/tools/developer/JavascriptFormatter').then(m => ({ default: m.JavascriptFormatter })));
const Base64Encoder = lazy(() => import('../components/tools/developer/Base64Encoder').then(m => ({ default: m.Base64Encoder })));
const Base64Decoder = lazy(() => import('../components/tools/developer/Base64Decoder').then(m => ({ default: m.Base64Decoder })));
const UrlEncoder = lazy(() => import('../components/tools/developer/UrlEncoder').then(m => ({ default: m.UrlEncoder })));
const UrlDecoder = lazy(() => import('../components/tools/developer/UrlDecoder').then(m => ({ default: m.UrlDecoder })));
const JwtDecoder = lazy(() => import('../components/tools/developer/JwtDecoder').then(m => ({ default: m.JwtDecoder })));
const UuidGenerator = lazy(() => import('../components/tools/developer/UuidGenerator').then(m => ({ default: m.UuidGenerator })));
const PasswordGenerator = lazy(() => import('../components/tools/developer/PasswordGenerator').then(m => ({ default: m.PasswordGenerator })));
const HashGenerator = lazy(() => import('../components/tools/developer/HashGenerator').then(m => ({ default: m.HashGenerator })));
const RegexTester = lazy(() => import('../components/tools/developer/RegexTester').then(m => ({ default: m.RegexTester })));
const HtmlEntityEncoder = lazy(() => import('../components/tools/developer/HtmlEntityEncoder').then(m => ({ default: m.HtmlEntityEncoder })));
const HtmlEntityDecoder = lazy(() => import('../components/tools/developer/HtmlEntityDecoder').then(m => ({ default: m.HtmlEntityDecoder })));
const TimestampConverter = lazy(() => import('../components/tools/developer/TimestampConverter').then(m => ({ default: m.TimestampConverter })));
const ColorCodeConverter = lazy(() => import('../components/tools/developer/ColorCodeConverter').then(m => ({ default: m.ColorCodeConverter })));
const CssGradientGenerator = lazy(() => import('../components/tools/developer/CssGradientGenerator').then(m => ({ default: m.CssGradientGenerator })));
const MetaTagGenerator = lazy(() => import('../components/tools/developer/MetaTagGenerator').then(m => ({ default: m.MetaTagGenerator })));
const RobotsTxtGenerator = lazy(() => import('../components/tools/developer/RobotsTxtGenerator').then(m => ({ default: m.RobotsTxtGenerator })));
const SitemapGenerator = lazy(() => import('../components/tools/developer/SitemapGenerator').then(m => ({ default: m.SitemapGenerator })));
const QrCodeGenerator = lazy(() => import('../components/tools/developer/QrCodeGenerator').then(m => ({ default: m.QrCodeGenerator })));

// Category E: Image Tools
const ImageResizer = lazy(() => import('../components/tools/image/ImageResizer').then(m => ({ default: m.ImageResizer })));
const ImageCompressor = lazy(() => import('../components/tools/image/ImageCompressor').then(m => ({ default: m.ImageCompressor })));
const ImageCropper = lazy(() => import('../components/tools/image/ImageCropper').then(m => ({ default: m.ImageCropper })));
const ImageFormatConverter = lazy(() => import('../components/tools/image/ImageFormatConverter').then(m => ({ default: m.ImageFormatConverter })));
const JpgToPng = lazy(() => import('../components/tools/image/JpgToPng').then(m => ({ default: m.JpgToPng })));
const PngToJpg = lazy(() => import('../components/tools/image/PngToJpg').then(m => ({ default: m.PngToJpg })));
const WebpConverter = lazy(() => import('../components/tools/image/WebpConverter').then(m => ({ default: m.WebpConverter })));
const ImageRotator = lazy(() => import('../components/tools/image/ImageRotator').then(m => ({ default: m.ImageRotator })));
const ImageFlipper = lazy(() => import('../components/tools/image/ImageFlipper').then(m => ({ default: m.ImageFlipper })));
const ImageColorPicker = lazy(() => import('../components/tools/image/ImageColorPicker').then(m => ({ default: m.ImageColorPicker })));
const ImageMetadataViewer = lazy(() => import('../components/tools/image/ImageMetadataViewer').then(m => ({ default: m.ImageMetadataViewer })));
const ImageDimensionsChecker = lazy(() => import('../components/tools/image/ImageDimensionsChecker').then(m => ({ default: m.ImageDimensionsChecker })));
const FaviconGenerator = lazy(() => import('../components/tools/image/FaviconGenerator').then(m => ({ default: m.FaviconGenerator })));
const ImageToBase64 = lazy(() => import('../components/tools/image/ImageToBase64').then(m => ({ default: m.ImageToBase64 })));
const Base64ToImage = lazy(() => import('../components/tools/image/Base64ToImage').then(m => ({ default: m.Base64ToImage })));

// Category F: QR & Generators
const UrlQrGenerator = lazy(() => import('../components/tools/generators/UrlQrGenerator').then(m => ({ default: m.UrlQrGenerator })));
const WifiQrGenerator = lazy(() => import('../components/tools/generators/WifiQrGenerator').then(m => ({ default: m.WifiQrGenerator })));
const ContactQrGenerator = lazy(() => import('../components/tools/generators/ContactQrGenerator').then(m => ({ default: m.ContactQrGenerator })));
const EmailQrGenerator = lazy(() => import('../components/tools/generators/EmailQrGenerator').then(m => ({ default: m.EmailQrGenerator })));
const PhoneQrGenerator = lazy(() => import('../components/tools/generators/PhoneQrGenerator').then(m => ({ default: m.PhoneQrGenerator })));
const SmsQrGenerator = lazy(() => import('../components/tools/generators/SmsQrGenerator').then(m => ({ default: m.SmsQrGenerator })));
const LocationQrGenerator = lazy(() => import('../components/tools/generators/LocationQrGenerator').then(m => ({ default: m.LocationQrGenerator })));
const WhatsappQrGenerator = lazy(() => import('../components/tools/generators/WhatsappQrGenerator').then(m => ({ default: m.WhatsappQrGenerator })));
const VcardQrGenerator = lazy(() => import('../components/tools/generators/VcardQrGenerator').then(m => ({ default: m.VcardQrGenerator })));
const QrCodeScanner = lazy(() => import('../components/tools/generators/QrCodeScanner').then(m => ({ default: m.QrCodeScanner })));
const RandomNumberGenerator = lazy(() => import('../components/tools/generators/RandomNumberGenerator').then(m => ({ default: m.RandomNumberGenerator })));
const RandomPasswordGenerator = lazy(() => import('../components/tools/generators/RandomPasswordGenerator').then(m => ({ default: m.RandomPasswordGenerator })));
const UuidGeneratorTool = lazy(() => import('../components/tools/generators/UuidGeneratorTool').then(m => ({ default: m.UuidGeneratorTool })));
const UsernameGenerator = lazy(() => import('../components/tools/generators/UsernameGenerator').then(m => ({ default: m.UsernameGenerator })));
const ColorPaletteGenerator = lazy(() => import('../components/tools/generators/ColorPaletteGenerator').then(m => ({ default: m.ColorPaletteGenerator })));

// Category G: Daily Productivity
const TodoList = lazy(() => import('../components/tools/productivity/TodoList').then(m => ({ default: m.TodoList })));
const QuickNotes = lazy(() => import('../components/tools/productivity/QuickNotes').then(m => ({ default: m.QuickNotes })));
const StickyNotes = lazy(() => import('../components/tools/productivity/StickyNotes').then(m => ({ default: m.StickyNotes })));
const DailyPlanner = lazy(() => import('../components/tools/productivity/DailyPlanner').then(m => ({ default: m.DailyPlanner })));
const WeeklyPlanner = lazy(() => import('../components/tools/productivity/WeeklyPlanner').then(m => ({ default: m.WeeklyPlanner })));
const HabitTracker = lazy(() => import('../components/tools/productivity/HabitTracker').then(m => ({ default: m.HabitTracker })));
const PomodoroTimer = lazy(() => import('../components/tools/productivity/PomodoroTimer').then(m => ({ default: m.PomodoroTimer })));
const StopwatchTool = lazy(() => import('../components/tools/productivity/StopwatchTool').then(m => ({ default: m.StopwatchTool })));
const CountdownTimer = lazy(() => import('../components/tools/productivity/CountdownTimer').then(m => ({ default: m.CountdownTimer })));
const WorldClock = lazy(() => import('../components/tools/productivity/WorldClock').then(m => ({ default: m.WorldClock })));
const MeetingPlanner = lazy(() => import('../components/tools/productivity/MeetingPlanner').then(m => ({ default: m.MeetingPlanner })));
const GoalTracker = lazy(() => import('../components/tools/productivity/GoalTracker').then(m => ({ default: m.GoalTracker })));
const ChecklistMaker = lazy(() => import('../components/tools/productivity/ChecklistMaker').then(m => ({ default: m.ChecklistMaker })));
const ReadingTracker = lazy(() => import('../components/tools/productivity/ReadingTracker').then(m => ({ default: m.ReadingTracker })));
const StudyPlanner = lazy(() => import('../components/tools/productivity/StudyPlanner').then(m => ({ default: m.StudyPlanner })));

// Category H: Personal Finance
const DailyExpenseTracker = lazy(() => import('../components/tools/finance/DailyExpenseTracker').then(m => ({ default: m.DailyExpenseTracker })));
const MonthlyBudgetPlanner = lazy(() => import('../components/tools/finance/MonthlyBudgetPlanner').then(m => ({ default: m.MonthlyBudgetPlanner })));
const SavingsGoalCalculator = lazy(() => import('../components/tools/finance/SavingsGoalCalculator').then(m => ({ default: m.SavingsGoalCalculator })));
const SavingsTracker = lazy(() => import('../components/tools/finance/SavingsTracker').then(m => ({ default: m.SavingsTracker })));
const IncomeTracker = lazy(() => import('../components/tools/finance/IncomeTracker').then(m => ({ default: m.IncomeTracker })));
const ExpenseSplitter = lazy(() => import('../components/tools/finance/ExpenseSplitter').then(m => ({ default: m.ExpenseSplitter })));
const SubscriptionTracker = lazy(() => import('../components/tools/finance/SubscriptionTracker').then(m => ({ default: m.SubscriptionTracker })));
const BillReminder = lazy(() => import('../components/tools/finance/BillReminder').then(m => ({ default: m.BillReminder })));
const ShoppingBudgetCalculator = lazy(() => import('../components/tools/finance/ShoppingBudgetCalculator').then(m => ({ default: m.ShoppingBudgetCalculator })));
const PriceComparisonCalculator = lazy(() => import('../components/tools/finance/PriceComparisonCalculator').then(m => ({ default: m.PriceComparisonCalculator })));
const UnitPriceCalculator = lazy(() => import('../components/tools/finance/UnitPriceCalculator').then(m => ({ default: m.UnitPriceCalculator })));
const CurrencyDenominationCalculator = lazy(() => import('../components/tools/finance/CurrencyDenominationCalculator').then(m => ({ default: m.CurrencyDenominationCalculator })));
const CashCounter = lazy(() => import('../components/tools/finance/CashCounter').then(m => ({ default: m.CashCounter })));
const ChangeCalculator = lazy(() => import('../components/tools/finance/ChangeCalculator').then(m => ({ default: m.ChangeCalculator })));
const MonthlyExpenseSummary = lazy(() => import('../components/tools/finance/MonthlyExpenseSummary').then(m => ({ default: m.MonthlyExpenseSummary })));

// Category I: Date & Time
const CalendarGenerator = lazy(() => import('../components/tools/datetime/CalendarGenerator').then(m => ({ default: m.CalendarGenerator })));
const MonthlyCalendar = lazy(() => import('../components/tools/datetime/MonthlyCalendar').then(m => ({ default: m.MonthlyCalendar })));
const YearlyCalendar = lazy(() => import('../components/tools/datetime/YearlyCalendar').then(m => ({ default: m.YearlyCalendar })));
const DateToDayFinder = lazy(() => import('../components/tools/datetime/DateToDayFinder').then(m => ({ default: m.DateToDayFinder })));
const BirthdayCountdown = lazy(() => import('../components/tools/datetime/BirthdayCountdown').then(m => ({ default: m.BirthdayCountdown })));
const EventCountdown = lazy(() => import('../components/tools/datetime/EventCountdown').then(m => ({ default: m.EventCountdown })));
const TimezoneMeetingPlanner = lazy(() => import('../components/tools/datetime/TimezoneMeetingPlanner').then(m => ({ default: m.TimezoneMeetingPlanner })));
const WorkingHoursTracker = lazy(() => import('../components/tools/datetime/WorkingHoursTracker').then(m => ({ default: m.WorkingHoursTracker })));
const ShiftTimeCalculator = lazy(() => import('../components/tools/datetime/ShiftTimeCalculator').then(m => ({ default: m.ShiftTimeCalculator })));
const SleepSchedulePlanner = lazy(() => import('../components/tools/datetime/SleepSchedulePlanner').then(m => ({ default: m.SleepSchedulePlanner })));

// Category J: Student & Education
const CgpaCalculator = lazy(() => import('../components/tools/education/CgpaCalculator').then(m => ({ default: m.CgpaCalculator })));
const SgpaCalculator = lazy(() => import('../components/tools/education/SgpaCalculator').then(m => ({ default: m.SgpaCalculator })));
const PercentageToCgpaConverter = lazy(() => import('../components/tools/education/PercentageToCgpaConverter').then(m => ({ default: m.PercentageToCgpaConverter })));
const MarksCalculator = lazy(() => import('../components/tools/education/MarksCalculator').then(m => ({ default: m.MarksCalculator })));
const GradeCalculator = lazy(() => import('../components/tools/education/GradeCalculator').then(m => ({ default: m.GradeCalculator })));
const AttendanceCalculator = lazy(() => import('../components/tools/education/AttendanceCalculator').then(m => ({ default: m.AttendanceCalculator })));
const AttendanceShortageCalculator = lazy(() => import('../components/tools/education/AttendanceShortageCalculator').then(m => ({ default: m.AttendanceShortageCalculator })));
const StudySessionTracker = lazy(() => import('../components/tools/education/StudySessionTracker').then(m => ({ default: m.StudySessionTracker })));
const ExamCountdown = lazy(() => import('../components/tools/education/ExamCountdown').then(m => ({ default: m.ExamCountdown })));
const TimetableGenerator = lazy(() => import('../components/tools/education/TimetableGenerator').then(m => ({ default: m.TimetableGenerator })));
const FlashcardCreator = lazy(() => import('../components/tools/education/FlashcardCreator').then(m => ({ default: m.FlashcardCreator })));
const RevisionPlanner = lazy(() => import('../components/tools/education/RevisionPlanner').then(m => ({ default: m.RevisionPlanner })));
const RandomQuestionPicker = lazy(() => import('../components/tools/education/RandomQuestionPicker').then(m => ({ default: m.RandomQuestionPicker })));
const ScientificNotationConverter = lazy(() => import('../components/tools/education/ScientificNotationConverter').then(m => ({ default: m.ScientificNotationConverter })));
const MathExpressionEvaluator = lazy(() => import('../components/tools/education/MathExpressionEvaluator').then(m => ({ default: m.MathExpressionEvaluator })));

// Category K: Privacy & Security
const PasswordStrengthChecker = lazy(() => import('../components/tools/security/PasswordStrengthChecker').then(m => ({ default: m.PasswordStrengthChecker })));
const PassphraseGenerator = lazy(() => import('../components/tools/security/PassphraseGenerator').then(m => ({ default: m.PassphraseGenerator })));
const SecurePinGenerator = lazy(() => import('../components/tools/security/SecurePinGenerator').then(m => ({ default: m.SecurePinGenerator })));
const TextEncryptionTool = lazy(() => import('../components/tools/security/TextEncryptionTool').then(m => ({ default: m.TextEncryptionTool })));
const TextDecryptionTool = lazy(() => import('../components/tools/security/TextDecryptionTool').then(m => ({ default: m.TextDecryptionTool })));
const FileHashChecker = lazy(() => import('../components/tools/security/FileHashChecker').then(m => ({ default: m.FileHashChecker })));
const FileChecksumVerifier = lazy(() => import('../components/tools/security/FileChecksumVerifier').then(m => ({ default: m.FileChecksumVerifier })));
const SecureRandomGenerator = lazy(() => import('../components/tools/security/SecureRandomGenerator').then(m => ({ default: m.SecureRandomGenerator })));
const PersonalDataMasker = lazy(() => import('../components/tools/security/PersonalDataMasker').then(m => ({ default: m.PersonalDataMasker })));
const SensitiveTextRedactor = lazy(() => import('../components/tools/security/SensitiveTextRedactor').then(m => ({ default: m.SensitiveTextRedactor })));
const UrlSafetyAnalyzer = lazy(() => import('../components/tools/security/UrlSafetyAnalyzer').then(m => ({ default: m.UrlSafetyAnalyzer })));
const QrCodeContentInspector = lazy(() => import('../components/tools/security/QrCodeContentInspector').then(m => ({ default: m.QrCodeContentInspector })));

// Category L: File & Document Utilities
const CsvViewer = lazy(() => import('../components/tools/files/CsvViewer').then(m => ({ default: m.CsvViewer })));
const CsvToJsonConverter = lazy(() => import('../components/tools/files/CsvToJsonConverter').then(m => ({ default: m.CsvToJsonConverter })));
const JsonToCsvConverter = lazy(() => import('../components/tools/files/JsonToCsvConverter').then(m => ({ default: m.JsonToCsvConverter })));
const TsvToCsvConverter = lazy(() => import('../components/tools/files/TsvToCsvConverter').then(m => ({ default: m.TsvToCsvConverter })));
const TextFileViewer = lazy(() => import('../components/tools/files/TextFileViewer').then(m => ({ default: m.TextFileViewer })));
const TextFileMerger = lazy(() => import('../components/tools/files/TextFileMerger').then(m => ({ default: m.TextFileMerger })));
const TextFileSplitter = lazy(() => import('../components/tools/files/TextFileSplitter').then(m => ({ default: m.TextFileSplitter })));
const FileSizeAnalyzer = lazy(() => import('../components/tools/files/FileSizeAnalyzer').then(m => ({ default: m.FileSizeAnalyzer })));
const FileTypeInspector = lazy(() => import('../components/tools/files/FileTypeInspector').then(m => ({ default: m.FileTypeInspector })));
const FileChecksumGenerator = lazy(() => import('../components/tools/files/FileChecksumGenerator').then(m => ({ default: m.FileChecksumGenerator })));
const PdfPageCounter = lazy(() => import('../components/tools/files/PdfPageCounter').then(m => ({ default: m.PdfPageCounter })));
const PdfMetadataViewer = lazy(() => import('../components/tools/files/PdfMetadataViewer').then(m => ({ default: m.PdfMetadataViewer })));
const PdfMerger = lazy(() => import('../components/tools/files/PdfMerger').then(m => ({ default: m.PdfMerger })));
const PdfSplitter = lazy(() => import('../components/tools/files/PdfSplitter').then(m => ({ default: m.PdfSplitter })));
const PdfPageExtractor = lazy(() => import('../components/tools/files/PdfPageExtractor').then(m => ({ default: m.PdfPageExtractor })));
const PdfRotationTool = lazy(() => import('../components/tools/files/PdfRotationTool').then(m => ({ default: m.PdfRotationTool })));
const PdfCompressor = lazy(() => import('../components/tools/files/PdfCompressor').then(m => ({ default: m.PdfCompressor })));

// Category M: Everyday Life Tools
const GroceryListMaker = lazy(() => import('../components/tools/everyday/GroceryListMaker').then(m => ({ default: m.GroceryListMaker })));
const ShoppingListManager = lazy(() => import('../components/tools/everyday/ShoppingListManager').then(m => ({ default: m.ShoppingListManager })));
const PackingListGenerator = lazy(() => import('../components/tools/everyday/PackingListGenerator').then(m => ({ default: m.PackingListGenerator })));
const RecipeMeasurementCalculator = lazy(() => import('../components/tools/everyday/RecipeMeasurementCalculator').then(m => ({ default: m.RecipeMeasurementCalculator })));
const CookingTimer = lazy(() => import('../components/tools/everyday/CookingTimer').then(m => ({ default: m.CookingTimer })));
const WaterIntakeReminder = lazy(() => import('../components/tools/everyday/WaterIntakeReminder').then(m => ({ default: m.WaterIntakeReminder })));
const DailyRoutinePlanner = lazy(() => import('../components/tools/everyday/DailyRoutinePlanner').then(m => ({ default: m.DailyRoutinePlanner })));
const TravelChecklist = lazy(() => import('../components/tools/everyday/TravelChecklist').then(m => ({ default: m.TravelChecklist })));
const TripBudgetCalculator = lazy(() => import('../components/tools/everyday/TripBudgetCalculator').then(m => ({ default: m.TripBudgetCalculator })));
const FuelMileageCalculator = lazy(() => import('../components/tools/everyday/FuelMileageCalculator').then(m => ({ default: m.FuelMileageCalculator })));
const CarMaintenanceTracker = lazy(() => import('../components/tools/everyday/CarMaintenanceTracker').then(m => ({ default: m.CarMaintenanceTracker })));
const ElectricityConsumptionEstimator = lazy(() => import('../components/tools/everyday/ElectricityConsumptionEstimator').then(m => ({ default: m.ElectricityConsumptionEstimator })));
const InternetDataUsageCalculator = lazy(() => import('../components/tools/everyday/InternetDataUsageCalculator').then(m => ({ default: m.InternetDataUsageCalculator })));
const AgeOnDateCalculator = lazy(() => import('../components/tools/everyday/AgeOnDateCalculator').then(m => ({ default: m.AgeOnDateCalculator })));
const RandomDecisionMaker = lazy(() => import('../components/tools/everyday/RandomDecisionMaker').then(m => ({ default: m.RandomDecisionMaker })));

export const TOOLS_REGISTRY: ToolItem[] = [
  // ==========================================
  // CATEGORY A: CALCULATORS (24)
  // ==========================================
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    shortDescription: 'Calculate precise age in years, months, days, hours, and seconds from birth date.',
    category: 'calculators',
    iconName: 'Calendar',
    keywords: ['age', 'birthday', 'chronological age', 'years old', 'birth date', 'time lived'],
    isPopular: true,
    instructions: [
      'Select your exact Date of Birth from the date picker.',
      'Optionally specify your birth time for second-level precision.',
      'The calculator instantly breaks down your lived time, next birthday milestone, and Chinese zodiac.'
    ],
    faqs: [
      { question: 'How is leap year age accounted for?', answer: 'The calculation calculates complete astronomical calendar cycles, accounting for all leap years.' },
      { question: 'Is my birthday stored anywhere?', answer: 'No. All calculations run strictly in your web browser.' }
    ],
    relatedTools: ['date-difference-calculator', 'days-between-dates', 'time-duration-calculator'],
    component: AgeCalculator
  },
  {
    id: 'date-difference-calculator',
    name: 'Date Difference Calculator',
    shortDescription: 'Calculate elapsed calendar difference between two specific dates in years, months, and days.',
    category: 'calculators',
    iconName: 'CalendarDays',
    keywords: ['date difference', 'calendar math', 'span', 'interval', 'elapsed time'],
    instructions: [
      'Enter the starting date.',
      'Enter the target end date.',
      'Toggle whether the end date itself is included in the count.'
    ],
    faqs: [
      { question: 'Does this handle BC dates or leap centuries?', answer: 'Yes, modern Gregorian calendar rules are applied accurately.' }
    ],
    relatedTools: ['days-between-dates', 'age-calculator', 'working-days-calculator'],
    component: DateDifferenceCalculator
  },
  {
    id: 'days-between-dates',
    name: 'Days Between Dates',
    shortDescription: 'Quickly find the total number of days, weeks, and weekends between two dates.',
    category: 'calculators',
    iconName: 'Clock',
    keywords: ['days between', 'day counter', 'countdown', 'event span'],
    instructions: [
      'Pick a Start Date and an End Date.',
      'Check "Include end day" if you want both boundaries included.'
    ],
    faqs: [
      { question: 'What is the maximum date range?', answer: 'Any dates supported by modern standard Javascript Date (approx ±100 million days).' }
    ],
    relatedTools: ['date-difference-calculator', 'working-days-calculator'],
    component: DaysBetweenDates
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    shortDescription: 'Solve 6 common percentage questions: X% of Y, percentage increase/decrease, fractions.',
    category: 'calculators',
    iconName: 'Percent',
    keywords: ['percentage', 'percent', 'fraction', 'growth rate', 'ratio', 'markup'],
    isPopular: true,
    instructions: [
      'Choose the percentage question formula you need.',
      'Input the values; real-time recalculation occurs as you type.',
      'Click the copy icon beside any result to copy it.'
    ],
    faqs: [
      { question: 'How are percentage changes calculated?', answer: 'Percentage change = ((New Value - Old Value) / |Old Value|) * 100.' }
    ],
    relatedTools: ['discount-calculator', 'profit-loss-calculator', 'ratio-calculator'],
    component: PercentageCalculator
  },
  {
    id: 'discount-calculator',
    name: 'Discount Calculator',
    shortDescription: 'Calculate final sale prices, money saved, and stacked promotional discounts.',
    category: 'calculators',
    iconName: 'BadgePercent',
    keywords: ['discount', 'sale', 'promo', 'clearance', 'markdown', 'coupon'],
    instructions: [
      'Enter the original retail price.',
      'Enter the primary discount percentage.',
      'Optionally toggle a stacked second discount or sales tax.'
    ],
    faqs: [
      { question: 'How does stacked discount work?', answer: 'The secondary discount is applied to the reduced subtotal after the first discount.' }
    ],
    relatedTools: ['percentage-calculator', 'gst-calculator', 'profit-loss-calculator'],
    component: DiscountCalculator
  },
  {
    id: 'gst-calculator',
    name: 'GST Calculator',
    shortDescription: 'Calculate Goods and Services Tax: Add GST or extract inclusive GST with slab breakdowns.',
    category: 'calculators',
    iconName: 'Receipt',
    keywords: ['gst', 'tax', 'vat', 'sales tax', 'cgst', 'sgst', 'igst'],
    isPopular: true,
    instructions: [
      'Enter the base net amount or total gross price.',
      'Select a preset GST tax rate (5%, 12%, 18%, 28%) or custom rate.',
      'Choose whether to Add GST (exclusive) or Remove GST (inclusive).'
    ],
    faqs: [
      { question: 'What is CGST and SGST?', answer: 'For intra-state transactions, GST is split equally into Central GST and State GST.' }
    ],
    disclaimer: 'Tax rates and regulations vary by jurisdiction. Consult a registered certified tax professional for official audits.',
    relatedTools: ['discount-calculator', 'salary-calculator', 'percentage-calculator'],
    component: GstCalculator
  },
  {
    id: 'emi-calculator',
    name: 'EMI Calculator',
    shortDescription: 'Compute monthly loan EMIs, total interest payable, and yearly amortization schedule.',
    category: 'calculators',
    iconName: 'CreditCard',
    keywords: ['emi', 'loan', 'mortgage', 'car loan', 'home loan', 'amortization'],
    isPopular: true,
    instructions: [
      'Input principal loan amount.',
      'Specify the annual interest rate (%).',
      'Choose the loan tenure in years or months.',
      'View the interactive breakdown of Principal vs Interest and full repayment table.'
    ],
    faqs: [
      { question: 'What EMI formula is used?', answer: 'EMI = [P x R x (1+R)^N] / [(1+R)^N - 1], where R is monthly interest rate and N is number of months.' }
    ],
    disclaimer: 'Actual lender terms, processing fees, and compounding periods may alter final repayments.',
    relatedTools: ['loan-calculator', 'compound-interest-calculator', 'simple-interest-calculator'],
    component: EmiCalculator
  },
  {
    id: 'loan-calculator',
    name: 'Loan Calculator',
    shortDescription: 'Comprehensive personal, student, and mortgage loan simulator with extra repayment modeling.',
    category: 'calculators',
    iconName: 'Banknote',
    keywords: ['loan', 'debt', 'mortgage', 'repayment', 'amortization', 'borrow'],
    instructions: [
      'Enter total borrowed amount.',
      'Input the annual interest rate and repayment period.',
      'Add an optional monthly extra payment to observe interest savings.'
    ],
    faqs: [
      { question: 'How much interest does extra payments save?', answer: 'Extra payments go directly towards reducing principal balance, exponentially decreasing total interest over time.' }
    ],
    disclaimer: 'Estimates do not include insurance, escrow, origination points, or penalties.',
    relatedTools: ['emi-calculator', 'compound-interest-calculator'],
    component: LoanCalculator
  },
  {
    id: 'simple-interest-calculator',
    name: 'Simple Interest Calculator',
    shortDescription: 'Calculate simple interest, maturity amount, and yearly yield on deposits or notes.',
    category: 'calculators',
    iconName: 'Coins',
    keywords: ['simple interest', 'si', 'pnr', 'interest rate', 'maturity'],
    instructions: [
      'Input the Principal amount.',
      'Input the annual interest rate.',
      'Enter time period in years or months.'
    ],
    faqs: [
      { question: 'What is the simple interest equation?', answer: 'Simple Interest (SI) = (Principal × Rate × Time) / 100.' }
    ],
    relatedTools: ['compound-interest-calculator', 'loan-calculator'],
    component: SimpleInterestCalculator
  },
  {
    id: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    shortDescription: 'Model the compounding growth of investments, savings, and 401(k) retirement accounts.',
    category: 'calculators',
    iconName: 'TrendingUp',
    keywords: ['compound interest', 'investing', 'wealth', 'savings', 'returns', '401k'],
    isPopular: true,
    instructions: [
      'Enter your initial starting principal.',
      'Input regular monthly or annual contribution amounts.',
      'Set expected annual interest rate and compounding frequency.',
      'See total future balance, accrued interest, and breakdown chart.'
    ],
    faqs: [
      { question: 'What compounding frequencies are supported?', answer: 'Annually, Semi-Annually, Quarterly, Monthly, and Daily.' }
    ],
    disclaimer: 'Past historical returns are not indicative of future investment performance.',
    relatedTools: ['simple-interest-calculator', 'emi-calculator', 'salary-calculator'],
    component: CompoundInterestCalculator
  },
  {
    id: 'salary-calculator',
    name: 'Salary Calculator',
    shortDescription: 'Convert salary across hourly, daily, weekly, bi-weekly, monthly, and annual equivalents.',
    category: 'calculators',
    iconName: 'Wallet',
    keywords: ['salary', 'wage', 'hourly pay', 'take home', 'paycheck', 'annual salary'],
    instructions: [
      'Enter your pay rate and select its basis (hourly, weekly, annual, etc.).',
      'Adjust working hours per week (standard 40 hrs) and weeks worked per year.',
      'Review equivalent wages across every common pay period.'
    ],
    faqs: [
      { question: 'Are payroll taxes deducted?', answer: 'This computes gross earnings. Enter your estimated tax withholding percentage for net estimation.' }
    ],
    relatedTools: ['percentage-calculator', 'electricity-bill-calculator'],
    component: SalaryCalculator
  },
  {
    id: 'profit-loss-calculator',
    name: 'Profit & Loss Calculator',
    shortDescription: 'Calculate gross profit, net margin, markup percentage, and break-even selling prices.',
    category: 'calculators',
    iconName: 'Scale',
    keywords: ['profit', 'loss', 'margin', 'markup', 'cogs', 'retail profit'],
    instructions: [
      'Enter your Cost Price (CP).',
      'Enter your Selling Price (SP).',
      'Instantly see net profit/loss, margin percentage, and markup multiplier.'
    ],
    faqs: [
      { question: 'What is the difference between margin and markup?', answer: 'Margin is profit divided by Selling Price; Markup is profit divided by Cost Price.' }
    ],
    relatedTools: ['discount-calculator', 'percentage-calculator', 'gst-calculator'],
    component: ProfitLossCalculator
  },
  {
    id: 'electricity-bill-calculator',
    name: 'Electricity Bill Calculator',
    shortDescription: 'Estimate electrical appliance energy usage in kWh and total power utility cost.',
    category: 'calculators',
    iconName: 'Zap',
    keywords: ['electricity', 'power', 'kwh', 'energy bill', 'wattage', 'utility cost'],
    instructions: [
      'Enter appliance power in Watts (e.g. 1500W for AC or space heater).',
      'Enter estimated daily hours of operation.',
      'Enter your local electricity tariff per kWh (e.g. $0.14 or ₹8.00).'
    ],
    faqs: [
      { question: 'How is kWh calculated?', answer: 'kWh = (Watts × Hours) / 1000.' }
    ],
    relatedTools: ['fuel-cost-calculator', 'salary-calculator'],
    component: ElectricityBillCalculator
  },
  {
    id: 'fuel-cost-calculator',
    name: 'Fuel Cost Calculator',
    shortDescription: 'Calculate trip fuel costs, liters/gallons required, and per-passenger travel cost.',
    category: 'calculators',
    iconName: 'Fuel',
    keywords: ['fuel', 'gas', 'petrol', 'mileage', 'trip cost', 'road trip'],
    instructions: [
      'Enter trip distance in kilometers or miles.',
      'Enter vehicle fuel efficiency (km/L or MPG).',
      'Enter local fuel price per liter or gallon.',
      'Specify number of passengers to split road trip costs.'
    ],
    faqs: [
      { question: 'Can I use metric and imperial units?', answer: 'Yes, switch freely between KM & Liters or Miles & Gallons.' }
    ],
    relatedTools: ['speed-calculator', 'split-bill-calculator'],
    component: FuelCostCalculator
  },
  {
    id: 'tip-calculator',
    name: 'Tip Calculator',
    shortDescription: 'Quickly calculate restaurant tips, gratuity percentages, and total bill amounts.',
    category: 'calculators',
    iconName: 'HandCoins',
    keywords: ['tip', 'gratuity', 'restaurant', 'dining', 'bill', 'service fee'],
    instructions: [
      'Enter the bill total.',
      'Select a tip percentage (10%, 15%, 18%, 20%, 25%) or custom percentage.',
      'Toggle whether to round the total bill up to the nearest whole dollar.'
    ],
    faqs: [
      { question: 'Should tip be calculated before or after tax?', answer: 'Customarily, tips are calculated on the pre-tax food and beverage total.' }
    ],
    relatedTools: ['split-bill-calculator', 'percentage-calculator'],
    component: TipCalculator
  },
  {
    id: 'split-bill-calculator',
    name: 'Split Bill Calculator',
    shortDescription: 'Fairly divide shared dining checks, group travel expenses, tip, and tax among friends.',
    category: 'calculators',
    iconName: 'Users',
    keywords: ['split bill', 'split check', 'group expense', 'dinner bill', 'friends pay'],
    isPopular: true,
    instructions: [
      'Enter the raw bill subtotal.',
      'Select the tip percentage and local tax percentage.',
      'Choose the number of people sharing the check.',
      'View individual per-person shares and total.'
    ],
    faqs: [
      { question: 'Does it handle uneven splits?', answer: 'This tool performs equal division. For itemized splits, adjust individual sub-amounts.' }
    ],
    relatedTools: ['tip-calculator', 'percentage-calculator'],
    component: SplitBillCalculator
  },
  {
    id: 'time-duration-calculator',
    name: 'Time Duration Calculator',
    shortDescription: 'Add, subtract, or measure duration between two timestamps in hours, minutes, and seconds.',
    category: 'calculators',
    iconName: 'Hourglass',
    keywords: ['time duration', 'hours minutes seconds', 'time tracker', 'elapsed time'],
    instructions: [
      'Enter start time and end time (12-hour AM/PM or 24-hour).',
      'The exact hours, minutes, seconds, and total decimal hours are calculated.'
    ],
    faqs: [
      { question: 'Can it cross midnight?', answer: 'Yes, if the end time is chronologically earlier than start time, it assumes next-day completion.' }
    ],
    relatedTools: ['working-days-calculator', 'date-difference-calculator'],
    component: TimeDurationCalculator
  },
  {
    id: 'working-days-calculator',
    name: 'Working Days Calculator',
    shortDescription: 'Calculate business work days between dates, excluding weekends and customizable holidays.',
    category: 'calculators',
    iconName: 'Briefcase',
    keywords: ['working days', 'business days', 'work week', 'holidays', 'project deadline'],
    instructions: [
      'Pick a start date and an end date.',
      'Choose your weekend days (e.g. Saturday & Sunday).',
      'Enter any number of public holidays to exclude.'
    ],
    faqs: [
      { question: 'Can I define custom weekend policies?', answer: 'Yes, you can configure 5-day or 6-day work weeks.' }
    ],
    relatedTools: ['days-between-dates', 'date-difference-calculator'],
    component: WorkingDaysCalculator
  },
  {
    id: 'average-calculator',
    name: 'Average Calculator',
    shortDescription: 'Compute Mean, Median, Mode, Range, Sum, and Standard Deviation for any set of numbers.',
    category: 'calculators',
    iconName: 'BarChart2',
    keywords: ['average', 'mean', 'median', 'mode', 'standard deviation', 'statistics', 'range'],
    instructions: [
      'Enter numbers separated by spaces, commas, or new lines.',
      'Instantly view statistical metrics: Arithmetic Mean, Median, Mode, Geometric Mean, and Sample Variance.'
    ],
    faqs: [
      { question: 'What is the difference between Mean and Median?', answer: 'Mean is the sum divided by count; Median is the middle value when sorted, less sensitive to outliers.' }
    ],
    relatedTools: ['ratio-calculator', 'fraction-calculator'],
    component: AverageCalculator
  },
  {
    id: 'ratio-calculator',
    name: 'Ratio Calculator',
    shortDescription: 'Simplify ratios (A:B), find missing values in proportions (A:B = C:D), and scale ratios.',
    category: 'calculators',
    iconName: 'Divide',
    keywords: ['ratio', 'proportion', 'scaling', 'aspect ratio', 'fraction'],
    instructions: [
      'Enter known parts A and B to simplify to lowest terms.',
      'Or fill 3 parts of A : B = C : X to solve for the missing variable X.'
    ],
    faqs: [
      { question: 'Can it calculate aspect ratios?', answer: 'Yes, enter image or video pixel dimensions (e.g. 1920:1080) to simplify to 16:9.' }
    ],
    relatedTools: ['fraction-calculator', 'percentage-calculator'],
    component: RatioCalculator
  },
  {
    id: 'fraction-calculator',
    name: 'Fraction Calculator',
    shortDescription: 'Add, subtract, multiply, and divide fractions with step-by-step simplification and mixed numbers.',
    category: 'calculators',
    iconName: 'DivideSquare',
    keywords: ['fraction', 'numerator', 'denominator', 'mixed fraction', 'math'],
    instructions: [
      'Enter the first fraction (numerator & denominator).',
      'Select mathematical operation (+, -, ×, ÷).',
      'Enter the second fraction and inspect simplified fraction and decimal.'
    ],
    faqs: [
      { question: 'Are mixed fractions supported?', answer: 'Yes, inputs can accept whole numbers with fraction parts.' }
    ],
    relatedTools: ['ratio-calculator', 'percentage-calculator'],
    component: FractionCalculator
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    shortDescription: 'Calculate Body Mass Index (BMI), healthy weight range, and WHO classification.',
    category: 'calculators',
    iconName: 'Activity',
    keywords: ['bmi', 'body mass index', 'weight', 'health', 'fitness', 'obesity'],
    isPopular: true,
    instructions: [
      'Select Metric (kg/cm) or Imperial (lbs/ft-in) units.',
      'Enter height and current weight.',
      'Review your BMI score, healthy weight target, and visual indicator gauge.'
    ],
    faqs: [
      { question: 'Is BMI an accurate measure of body fat?', answer: 'BMI is an epidemiological screening indicator. It does not distinguish muscle mass from fat.' }
    ],
    disclaimer: 'Informational only. Not a medical diagnosis. Consult a qualified medical healthcare provider for clinical assessments.',
    relatedTools: ['calorie-calculator', 'weight-converter'],
    component: BmiCalculator
  },
  {
    id: 'calorie-calculator',
    name: 'Calorie Calculator',
    shortDescription: 'Estimate Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE).',
    category: 'calculators',
    iconName: 'Flame',
    keywords: ['calories', 'bmr', 'tdee', 'metabolism', 'diet', 'weight loss'],
    isPopular: true,
    instructions: [
      'Input age, gender, height, and weight.',
      'Select your average weekly exercise and physical activity tier.',
      'Review calories needed for maintenance, mild deficit, or lean bulk.'
    ],
    faqs: [
      { question: 'What formula is used?', answer: 'Uses the clinically validated Mifflin-St Jeor equation.' }
    ],
    disclaimer: 'Nutritional estimates are guidelines. Individual metabolic rates vary.',
    relatedTools: ['bmi-calculator', 'weight-converter'],
    component: CalorieCalculator
  },
  {
    id: 'speed-calculator',
    name: 'Speed Calculator',
    shortDescription: 'Calculate speed, distance, or travel time from any two known motion variables.',
    category: 'calculators',
    iconName: 'Gauge',
    keywords: ['speed', 'distance', 'time', 'velocity', 'pace', 'mph', 'km/h'],
    instructions: [
      'Select which variable you want to solve for: Speed, Distance, or Time.',
      'Enter the two known quantities in your chosen units.',
      'View converted rates in km/h, mph, m/s, and knots.'
    ],
    faqs: [
      { question: 'Can it compute running pace?', answer: 'Yes, it provides pace in minutes per kilometer or mile.' }
    ],
    relatedTools: ['fuel-cost-calculator', 'time-duration-calculator'],
    component: SpeedCalculator
  },

  // ==========================================
  // CATEGORY B: CONVERTERS (15)
  // ==========================================
  {
    id: 'length-converter',
    name: 'Length Converter',
    shortDescription: 'Convert meters, feet, inches, centimeters, kilometers, miles, yards, and nautical miles.',
    category: 'converters',
    iconName: 'Ruler',
    keywords: ['length', 'distance', 'meters', 'feet', 'inches', 'cm', 'miles', 'yards'],
    isPopular: true,
    instructions: ['Enter length quantity.', 'Select source unit and destination unit.', 'Instant live conversion updates.'],
    relatedTools: ['area-converter', 'volume-converter'],
    component: LengthConverter
  },
  {
    id: 'weight-converter',
    name: 'Weight Converter',
    shortDescription: 'Convert kilograms, pounds, ounces, grams, milligrams, stone, and metric tonnes.',
    category: 'converters',
    iconName: 'Scale',
    keywords: ['weight', 'mass', 'kg', 'lbs', 'pounds', 'grams', 'ounces', 'stone'],
    isPopular: true,
    instructions: ['Input mass value.', 'Select starting and target weight units.', 'Copy results with one click.'],
    relatedTools: ['length-converter', 'bmi-calculator'],
    component: WeightConverter
  },
  {
    id: 'temperature-converter',
    name: 'Temperature Converter',
    shortDescription: 'Accurately convert Celsius (°C), Fahrenheit (°F), Kelvin (K), and Rankine (°R).',
    category: 'converters',
    iconName: 'Thermometer',
    keywords: ['temperature', 'celsius', 'fahrenheit', 'kelvin', 'weather', 'degrees'],
    isPopular: true,
    instructions: ['Enter temperature value.', 'Select input scale to immediately see all other scales.'],
    relatedTools: ['cooking-measurement-converter', 'energy-converter'],
    component: TemperatureConverter
  },
  {
    id: 'area-converter',
    name: 'Area Converter',
    shortDescription: 'Convert square meters, square feet, acres, hectares, square kilometers, and square miles.',
    category: 'converters',
    iconName: 'Square',
    keywords: ['area', 'square feet', 'acres', 'hectares', 'sq meters', 'land area'],
    instructions: ['Enter area value.', 'Pick source and target units.'],
    relatedTools: ['length-converter', 'volume-converter'],
    component: AreaConverter
  },
  {
    id: 'volume-converter',
    name: 'Volume Converter',
    shortDescription: 'Convert liters, milliliters, cubic meters, gallons, quarts, pints, and fluid ounces.',
    category: 'converters',
    iconName: 'Boxes',
    keywords: ['volume', 'liters', 'gallons', 'milliliters', 'fluid ounces', 'cubic meters'],
    instructions: ['Input volume.', 'Choose liquid or volumetric units.'],
    relatedTools: ['cooking-measurement-converter', 'area-converter'],
    component: VolumeConverter
  },
  {
    id: 'speed-converter',
    name: 'Speed Converter',
    shortDescription: 'Convert kilometers per hour (km/h), miles per hour (mph), meters/sec, and knots.',
    category: 'converters',
    iconName: 'Gauge',
    keywords: ['speed', 'mph', 'km/h', 'knots', 'mach', 'velocity'],
    instructions: ['Enter speed value.', 'Select source and target units.'],
    relatedTools: ['speed-calculator', 'length-converter'],
    component: SpeedConverter
  },
  {
    id: 'time-converter',
    name: 'Time Converter',
    shortDescription: 'Convert between milliseconds, seconds, minutes, hours, days, weeks, and calendar years.',
    category: 'converters',
    iconName: 'Clock',
    keywords: ['time', 'seconds', 'hours', 'minutes', 'days', 'weeks', 'milliseconds'],
    instructions: ['Enter duration value.', 'Choose time intervals to see equivalent conversions.'],
    relatedTools: ['time-duration-calculator', 'date-difference-calculator'],
    component: TimeConverter
  },
  {
    id: 'data-storage-converter',
    name: 'Data Storage Converter',
    shortDescription: 'Convert bytes, kilobytes, megabytes, gigabytes, terabytes, petabytes in binary and decimal.',
    category: 'converters',
    iconName: 'HardDrive',
    keywords: ['data', 'bytes', 'mb', 'gb', 'tb', 'storage', 'file size', 'kibibytes'],
    isPopular: true,
    instructions: ['Input file or memory size.', 'Toggle between Decimal (1000) and Binary (1024) standard.'],
    relatedTools: ['data-storage-converter', 'timestamp-converter'],
    component: DataStorageConverter
  },
  {
    id: 'energy-converter',
    name: 'Energy Converter',
    shortDescription: 'Convert Joules, Kilojoules, Calories, Kilocalories, Watt-hours, and British Thermal Units (BTU).',
    category: 'converters',
    iconName: 'Zap',
    keywords: ['energy', 'joules', 'calories', 'kwh', 'btu', 'work'],
    instructions: ['Enter energy quantity.', 'Select energy units.'],
    relatedTools: ['power-converter', 'calorie-calculator'],
    component: EnergyConverter
  },
  {
    id: 'pressure-converter',
    name: 'Pressure Converter',
    shortDescription: 'Convert Pascals, Bar, PSI (pounds per sq inch), Atmospheres, Torr, and mmHg.',
    category: 'converters',
    iconName: 'GaugeCircle',
    keywords: ['pressure', 'psi', 'bar', 'pascal', 'atm', 'torr', 'tire pressure'],
    instructions: ['Enter pressure measurement.', 'Select input and output pressure scale.'],
    relatedTools: ['power-converter', 'energy-converter'],
    component: PressureConverter
  },
  {
    id: 'power-converter',
    name: 'Power Converter',
    shortDescription: 'Convert Watts, Kilowatts, Horsepower (hp), Megawatts, and Foot-pounds/min.',
    category: 'converters',
    iconName: 'Cpu',
    keywords: ['power', 'watts', 'horsepower', 'kilowatts', 'engine power'],
    instructions: ['Enter power rating.', 'Select source and target power unit.'],
    relatedTools: ['energy-converter', 'electricity-bill-calculator'],
    component: PowerConverter
  },
  {
    id: 'angle-converter',
    name: 'Angle Converter',
    shortDescription: 'Convert between Degrees, Radians, Gradians, Milliradians, and Arcseconds.',
    category: 'converters',
    iconName: 'Compass',
    keywords: ['angle', 'degrees', 'radians', 'gradians', 'geometry', 'trigonometry'],
    instructions: ['Enter angular measurement.', 'Pick source and destination units.'],
    relatedTools: ['length-converter', 'speed-calculator'],
    component: AngleConverter
  },
  {
    id: 'number-system-converter',
    name: 'Number System Converter',
    shortDescription: 'Convert numbers across Decimal, Binary (Base 2), Hexadecimal (Base 16), and Octal (Base 8).',
    category: 'converters',
    iconName: 'Binary',
    keywords: ['binary', 'hexadecimal', 'decimal', 'octal', 'base converter', 'radix'],
    isPopular: true,
    instructions: ['Enter any number in decimal, binary, hex, or octal.', 'All formats convert simultaneously.'],
    relatedTools: ['roman-numeral-converter', 'color-code-converter'],
    component: NumberSystemConverter
  },
  {
    id: 'roman-numeral-converter',
    name: 'Roman Numeral Converter',
    shortDescription: 'Convert Arabic numbers (1-3999) to Roman Numerals (I, V, X, L, C, D, M) and vice-versa.',
    category: 'converters',
    iconName: 'Hash',
    keywords: ['roman numerals', 'roman numbers', 'ancient numbers', 'number converter'],
    instructions: ['Type a standard number or paste Roman numerals.', 'Instant two-way conversion.'],
    relatedTools: ['number-system-converter'],
    component: RomanNumeralConverter
  },
  {
    id: 'cooking-measurement-converter',
    name: 'Cooking Measurement Converter',
    shortDescription: 'Convert kitchen recipe measures: Cups, Tablespoons, Teaspoons, Fluid Ounces, Grams, and Milliliters.',
    category: 'converters',
    iconName: 'Utensils',
    keywords: ['cooking', 'baking', 'cups', 'tablespoons', 'teaspoons', 'recipe', 'kitchen converter'],
    isPopular: true,
    instructions: ['Select ingredient type (flour, sugar, butter, liquid).', 'Convert cups to grams or milliliters.'],
    relatedTools: ['volume-converter', 'weight-converter'],
    component: CookingMeasurementConverter
  },

  // ==========================================
  // CATEGORY C: TEXT TOOLS (22)
  // ==========================================
  {
    id: 'word-counter',
    name: 'Word Counter',
    shortDescription: 'Real-time word, character, sentence, paragraph, reading time, and speaking time counter.',
    category: 'text',
    iconName: 'FileText',
    keywords: ['word counter', 'character count', 'reading time', 'essay length', 'word count'],
    isPopular: true,
    instructions: ['Paste or type text.', 'Real-time metrics update instantly as you write.'],
    relatedTools: ['character-counter', 'sentence-counter', 'line-counter'],
    component: WordCounter
  },
  {
    id: 'character-counter',
    name: 'Character Counter',
    shortDescription: 'Count total characters with and without whitespace, plus limits for Twitter/X and SMS.',
    category: 'text',
    iconName: 'Type',
    keywords: ['character counter', 'letter count', 'tweet length', 'sms length', 'text length'],
    instructions: ['Type or paste text into the box.', 'Inspect character counts with/without spaces.'],
    relatedTools: ['word-counter', 'sentence-counter'],
    component: CharacterCounter
  },
  {
    id: 'sentence-counter',
    name: 'Sentence Counter',
    shortDescription: 'Analyze text structure, count sentences, average words per sentence, and readability.',
    category: 'text',
    iconName: 'AlignLeft',
    keywords: ['sentence counter', 'readability', 'writing structure', 'syntax'],
    instructions: ['Enter text to inspect individual sentences and punctuation patterns.'],
    relatedTools: ['word-counter', 'character-counter'],
    component: SentenceCounter
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    shortDescription: 'Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case.',
    category: 'text',
    iconName: 'SpellCheck',
    keywords: ['case converter', 'capitalization', 'camelcase', 'snake_case', 'uppercase'],
    isPopular: true,
    instructions: ['Type or paste text.', 'Click any format button to convert immediately.'],
    relatedTools: ['uppercase-converter', 'lowercase-converter', 'slug-generator'],
    component: CaseConverter
  },
  {
    id: 'uppercase-converter',
    name: 'Uppercase Converter',
    shortDescription: 'Instantly transform any text to all CAPITAL letters.',
    category: 'text',
    iconName: 'ArrowUpCircle',
    keywords: ['uppercase', 'caps lock', 'all caps', 'capital letters'],
    instructions: ['Paste text to immediately convert to uppercase.'],
    relatedTools: ['lowercase-converter', 'case-converter'],
    component: UppercaseConverter
  },
  {
    id: 'lowercase-converter',
    name: 'Lowercase Converter',
    shortDescription: 'Instantly convert all text characters to small, lowercase letters.',
    category: 'text',
    iconName: 'ArrowDownCircle',
    keywords: ['lowercase', 'small letters', 'uncapitalize'],
    instructions: ['Paste text to immediately convert to lowercase.'],
    relatedTools: ['uppercase-converter', 'case-converter'],
    component: LowercaseConverter
  },
  {
    id: 'title-case-converter',
    name: 'Title Case Converter',
    shortDescription: 'Capitalize headlines and book titles adhering to standard English grammar rules.',
    category: 'text',
    iconName: 'Heading',
    keywords: ['title case', 'headline case', 'capitalize titles', 'book title format'],
    instructions: ['Paste headlines to automatically format with intelligent lowercased prepositions.'],
    relatedTools: ['case-converter', 'sentence-counter'],
    component: TitleCaseConverter
  },
  {
    id: 'remove-duplicate-lines',
    name: 'Remove Duplicate Lines',
    shortDescription: 'Clean lists by removing identical duplicate lines while preserving original line order.',
    category: 'text',
    iconName: 'ListFilter',
    keywords: ['remove duplicate lines', 'deduplicate list', 'unique lines', 'filter duplicates'],
    isPopular: true,
    instructions: ['Paste your list or dataset.', 'Click remove duplicates to output clean unique entries.'],
    relatedTools: ['text-sorter', 'remove-extra-spaces'],
    component: RemoveDuplicateLines
  },
  {
    id: 'remove-extra-spaces',
    name: 'Remove Extra Spaces',
    shortDescription: 'Strip unnecessary trailing, leading, and repeated spaces or tabs from prose or code.',
    category: 'text',
    iconName: 'Eraser',
    keywords: ['remove spaces', 'whitespace cleaner', 'trim text', 'collapse spaces'],
    instructions: ['Paste messy text with irregular whitespace to clean and normalize instantly.'],
    relatedTools: ['text-cleaner', 'line-break-remover'],
    component: RemoveExtraSpaces
  },
  {
    id: 'text-sorter',
    name: 'Text Sorter',
    shortDescription: 'Sort lists alphabetically (A-Z, Z-A), numerically, by line length, or randomize order.',
    category: 'text',
    iconName: 'ArrowDownAZ',
    keywords: ['sort text', 'alphabetize', 'sort list', 'order lines', 'randomize list'],
    instructions: ['Paste list items.', 'Select sorting mode: Alphabetical, Numeric, Natural, or Reverse.'],
    relatedTools: ['remove-duplicate-lines', 'text-reverser'],
    component: TextSorter
  },
  {
    id: 'text-reverser',
    name: 'Text Reverser',
    shortDescription: 'Reverse entire text strings, reverse word order, or flip line order backwards.',
    category: 'text',
    iconName: 'RotateCcw',
    keywords: ['reverse text', 'backwards text', 'flip words', 'mirror text'],
    instructions: ['Type text to reverse characters, words, or full lines.'],
    relatedTools: ['text-sorter', 'case-converter'],
    component: TextReverser
  },
  {
    id: 'find-and-replace',
    name: 'Find and Replace',
    shortDescription: 'Search and replace words or patterns within text with match counting and Regex support.',
    category: 'text',
    iconName: 'Search',
    keywords: ['find and replace', 'search replace', 'substitute', 'regex replace'],
    instructions: ['Input your content.', 'Specify search string and replacement string.'],
    relatedTools: ['text-cleaner', 'regex-tester'],
    component: FindAndReplace
  },
  {
    id: 'text-diff-checker',
    name: 'Text Diff Checker',
    shortDescription: 'Compare two text snippets side-by-side to highlight added, removed, and modified lines.',
    category: 'text',
    iconName: 'GitCompare',
    keywords: ['diff checker', 'compare text', 'text difference', 'code diff', 'file compare'],
    isPopular: true,
    instructions: ['Paste original text on left.', 'Paste updated text on right.', 'Inspect colored line-by-line differences.'],
    relatedTools: ['find-and-replace', 'markdown-editor'],
    component: TextDiffChecker
  },
  {
    id: 'line-counter',
    name: 'Line Counter',
    shortDescription: 'Count total lines, non-empty lines, empty lines, and lines matching a custom search.',
    category: 'text',
    iconName: 'ListOrdered',
    keywords: ['line counter', 'count lines', 'code lines', 'loc'],
    instructions: ['Paste multiline text to inspect exact line breakdown.'],
    relatedTools: ['word-counter', 'character-counter'],
    component: LineCounter
  },
  {
    id: 'slug-generator',
    name: 'Slug Generator',
    shortDescription: 'Convert titles into SEO-friendly, URL-safe web slugs with custom hyphens.',
    category: 'text',
    iconName: 'Link',
    keywords: ['slug generator', 'url slug', 'seo friendly url', 'permalink generator'],
    instructions: ['Enter article or product title.', 'Copy generated URL slug.'],
    relatedTools: ['case-converter', 'meta-tag-generator'],
    component: SlugGenerator
  },
  {
    id: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    shortDescription: 'Generate dummy placeholder Latin text by paragraphs, sentences, or words.',
    category: 'text',
    iconName: 'FileCode2',
    keywords: ['lorem ipsum', 'dummy text', 'placeholder text', 'latin text', 'mock text'],
    isPopular: true,
    instructions: ['Select quantity of paragraphs or sentences.', 'Click copy to paste into mockups.'],
    relatedTools: ['word-counter', 'markdown-editor'],
    component: LoremIpsumGenerator
  },
  {
    id: 'text-cleaner',
    name: 'Text Cleaner',
    shortDescription: 'Remove unwanted punctuation, numbers, special characters, HTML tags, or line breaks.',
    category: 'text',
    iconName: 'Sparkles',
    keywords: ['clean text', 'strip html', 'remove punctuation', 'sanitize text'],
    instructions: ['Paste text with formatting issues and toggle specific cleanup rules.'],
    relatedTools: ['remove-extra-spaces', 'html-to-text'],
    component: TextCleaner
  },
  {
    id: 'markdown-editor',
    name: 'Markdown Editor',
    shortDescription: 'Live side-by-side Markdown editor with split-screen preview, styling, and HTML export.',
    category: 'text',
    iconName: 'FileEdit',
    keywords: ['markdown editor', 'md preview', 'markdown to html', 'live markdown'],
    isPopular: true,
    instructions: ['Write standard Markdown in the editor.', 'Real-time HTML preview updates alongside.'],
    relatedTools: ['html-to-text', 'text-to-html'],
    component: MarkdownEditor
  },
  {
    id: 'html-to-text',
    name: 'HTML to Text',
    shortDescription: 'Strip HTML tags, convert entities, and extract clean readable plaintext from web markup.',
    category: 'text',
    iconName: 'FileText',
    keywords: ['html to text', 'strip tags', 'extract plaintext', 'clean html'],
    instructions: ['Paste HTML source code.', 'Instant extraction of readable body text.'],
    relatedTools: ['text-to-html', 'html-formatter'],
    component: HtmlToText
  },
  {
    id: 'text-to-html',
    name: 'Text to HTML',
    shortDescription: 'Convert plain text paragraphs, line breaks, and characters into clean HTML markup.',
    category: 'text',
    iconName: 'Code',
    keywords: ['text to html', 'paragraph tags', 'br tags', 'html converter'],
    instructions: ['Paste plain text.', 'Automatically wraps paragraphs into <p> and breaks into <br/>.'],
    relatedTools: ['html-to-text', 'markdown-editor'],
    component: TextToHtml
  },
  {
    id: 'line-break-remover',
    name: 'Line Break Remover',
    shortDescription: 'Eliminate unwanted newlines and carriage returns from copied PDF or email text.',
    category: 'text',
    iconName: 'Minimize2',
    keywords: ['remove line breaks', 'join lines', 'unwrap text', 'fix pdf text'],
    instructions: ['Paste text copied from PDFs with awkward line breaks to format into single paragraphs.'],
    relatedTools: ['remove-extra-spaces', 'text-cleaner'],
    component: LineBreakRemover
  },
  {
    id: 'duplicate-word-remover',
    name: 'Duplicate Word Remover',
    shortDescription: 'Find and remove repeated consecutive or non-consecutive duplicate words in text.',
    category: 'text',
    iconName: 'CopyX',
    keywords: ['duplicate words', 'repeated words', 'proofread text', 'remove duplicates'],
    instructions: ['Paste draft text to highlight and remove redundant repeated words.'],
    relatedTools: ['remove-duplicate-lines', 'text-cleaner'],
    component: DuplicateWordRemover
  },

  // ==========================================
  // CATEGORY D: DEVELOPER TOOLS (26)
  // ==========================================
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    shortDescription: 'Beautify, indent, and format messy JSON strings with collapsible syntax tree view.',
    category: 'developer',
    iconName: 'Braces',
    keywords: ['json formatter', 'pretty print json', 'format json', 'beautify json'],
    isPopular: true,
    instructions: ['Paste raw JSON code.', 'Choose indentation level (2 or 4 spaces).', 'Inspect colored syntax.'],
    relatedTools: ['json-validator', 'json-minifier'],
    component: JsonFormatter
  },
  {
    id: 'json-validator',
    name: 'JSON Validator',
    shortDescription: 'Validate JSON syntax and pinpoint exact line and character positions of parse errors.',
    category: 'developer',
    iconName: 'CheckCircle2',
    keywords: ['json validator', 'lint json', 'json check', 'json errors'],
    instructions: ['Paste JSON string.', 'Identifies syntax errors, trailing commas, and unclosed quotes.'],
    relatedTools: ['json-formatter', 'xml-validator'],
    component: JsonValidator
  },
  {
    id: 'json-minifier',
    name: 'JSON Minifier',
    shortDescription: 'Compress and strip all whitespace and newlines from JSON to minimize payload bytes.',
    category: 'developer',
    iconName: 'Minimize',
    keywords: ['json minifier', 'compress json', 'compact json', 'shrink json'],
    instructions: ['Paste JSON to produce single-line compressed JSON output.'],
    relatedTools: ['json-formatter', 'base64-encoder'],
    component: JsonMinifier
  },
  {
    id: 'xml-formatter',
    name: 'XML Formatter',
    shortDescription: 'Format and indent XML documents, RSS feeds, and SVG files with clean indentation.',
    category: 'developer',
    iconName: 'FileCode',
    keywords: ['xml formatter', 'pretty print xml', 'beautify xml', 'format rss'],
    instructions: ['Paste XML markup to format with consistent tags and attributes.'],
    relatedTools: ['xml-validator', 'html-formatter'],
    component: XmlFormatter
  },
  {
    id: 'xml-validator',
    name: 'XML Validator',
    shortDescription: 'Validate XML syntax and tag matching using native browser XML DOM parsers.',
    category: 'developer',
    iconName: 'CheckSquare',
    keywords: ['xml validator', 'lint xml', 'xml well-formed', 'check xml'],
    instructions: ['Paste XML text to check for mismatched or unclosed tags.'],
    relatedTools: ['xml-formatter', 'json-validator'],
    component: XmlValidator
  },
  {
    id: 'html-formatter',
    name: 'HTML Formatter',
    shortDescription: 'Beautify and clean up raw HTML source code with uniform tag nesting.',
    category: 'developer',
    iconName: 'Code',
    keywords: ['html formatter', 'beautify html', 'pretty print html'],
    instructions: ['Paste HTML code.', 'Format nested tags and clean up whitespace.'],
    relatedTools: ['css-formatter', 'javascript-formatter'],
    component: HtmlFormatter
  },
  {
    id: 'css-formatter',
    name: 'CSS Formatter',
    shortDescription: 'Format and organize CSS style sheets with proper indentation and declaration lines.',
    category: 'developer',
    iconName: 'Palette',
    keywords: ['css formatter', 'beautify css', 'pretty print css', 'format styles'],
    instructions: ['Paste CSS rules to expand and format into clean readable blocks.'],
    relatedTools: ['html-formatter', 'css-gradient-generator'],
    component: CssFormatter
  },
  {
    id: 'javascript-formatter',
    name: 'JavaScript Formatter',
    shortDescription: 'Clean and format JavaScript/TypeScript code snippets with readable indentation.',
    category: 'developer',
    iconName: 'FileTerminal',
    keywords: ['js formatter', 'javascript beautifier', 'format typescript', 'js pretty print'],
    instructions: ['Paste raw JavaScript to clean braces, semicolons, and indentation.'],
    relatedTools: ['json-formatter', 'html-formatter'],
    component: JavascriptFormatter
  },
  {
    id: 'base64-encoder',
    name: 'Base64 Encoder',
    shortDescription: 'Encode plain text or binary strings into safe Base64 format with full UTF-8 support.',
    category: 'developer',
    iconName: 'Binary',
    keywords: ['base64 encode', 'base64', 'binary to text', 'encode string'],
    isPopular: true,
    instructions: ['Type or paste any text.', 'Instant client-side Base64 encoded string output.'],
    relatedTools: ['base64-decoder', 'url-encoder', 'image-to-base64'],
    component: Base64Encoder
  },
  {
    id: 'base64-decoder',
    name: 'Base64 Decoder',
    shortDescription: 'Decode Base64 encoded strings back into original human-readable UTF-8 text.',
    category: 'developer',
    iconName: 'FileCheck',
    keywords: ['base64 decode', 'decode base64', 'base64 to text'],
    isPopular: true,
    instructions: ['Paste a Base64 string to immediately view decoded plaintext.'],
    relatedTools: ['base64-encoder', 'url-decoder', 'jwt-decoder'],
    component: Base64Decoder
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder',
    shortDescription: 'Percent-encode query parameters and URI components for safe browser transmission.',
    category: 'developer',
    iconName: 'Link2',
    keywords: ['url encode', 'uri encode', 'percent encoding', 'url safe'],
    instructions: ['Paste URL or query string to encode special characters.'],
    relatedTools: ['url-decoder', 'slug-generator'],
    component: UrlEncoder
  },
  {
    id: 'url-decoder',
    name: 'URL Decoder',
    shortDescription: 'Decode percent-encoded (%20, %2F) URL parameters back into readable characters.',
    category: 'developer',
    iconName: 'Unlink',
    keywords: ['url decode', 'uri decode', 'decode url parameters'],
    instructions: ['Paste percent-encoded URL to inspect decoded parameters.'],
    relatedTools: ['url-encoder', 'base64-decoder'],
    component: UrlDecoder
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    shortDescription: 'Inspect JSON Web Tokens: view Header, Payload claims, expiration times, and algorithm.',
    category: 'developer',
    iconName: 'Shield',
    keywords: ['jwt decoder', 'json web token', 'jwt inspector', 'token payload', 'bearer token'],
    isPopular: true,
    instructions: ['Paste a standard JWT (header.payload.signature).', 'Instantly inspect decoded claims and dates.'],
    faqs: [
      { question: 'Does this verify cryptographic signatures?', answer: 'No. This is a client-side inspector tool that decodes public token claims without verifying secret keys.' }
    ],
    disclaimer: 'Decoding does not verify cryptographic signatures. Never paste private server signing keys.',
    relatedTools: ['base64-decoder', 'timestamp-converter', 'json-formatter'],
    component: JwtDecoder
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    shortDescription: 'Generate cryptographically random UUID v4 strings compliant with RFC 4122.',
    category: 'developer',
    iconName: 'Fingerprint',
    keywords: ['uuid generator', 'guid', 'v4 uuid', 'random uuid', 'unique id'],
    isPopular: true,
    instructions: ['Click generate to produce new RFC-compliant v4 UUIDs.'],
    relatedTools: ['password-generator', 'hash-generator', 'uuid-batch-generator'],
    component: UuidGenerator
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    shortDescription: 'Generate strong cryptographically secure passwords with entropy and custom rules.',
    category: 'developer',
    iconName: 'Lock',
    keywords: ['password generator', 'secure password', 'entropy', 'random password'],
    isPopular: true,
    instructions: ['Select desired length and character sets.', 'Copy cryptographically secure password.'],
    relatedTools: ['random-password-generator', 'hash-generator'],
    component: PasswordGenerator
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    shortDescription: 'Generate cryptographic SHA-256, SHA-512, SHA-1, and MD5 hashes using Web Crypto.',
    category: 'developer',
    iconName: 'Hash',
    keywords: ['hash generator', 'sha256', 'sha512', 'md5', 'checksum', 'crypto hash'],
    isPopular: true,
    instructions: ['Type or paste text.', 'All standard cryptographic digests calculate in parallel.'],
    relatedTools: ['password-generator', 'uuid-generator'],
    component: HashGenerator
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    shortDescription: 'Test and debug Regular Expressions in real-time with highlighted syntax matches and groups.',
    category: 'developer',
    iconName: 'FileSearch',
    keywords: ['regex tester', 'regular expression', 'regex match', 'regexp debugger'],
    isPopular: true,
    instructions: ['Enter regular expression pattern and flags (g, i, m).', 'Inspect matches in test string.'],
    relatedTools: ['find-and-replace', 'text-diff-checker'],
    component: RegexTester
  },
  {
    id: 'html-entity-encoder',
    name: 'HTML Entity Encoder',
    shortDescription: 'Convert special characters (&, <, >, ", \') into safe HTML named and numeric entities.',
    category: 'developer',
    iconName: 'FileCode',
    keywords: ['html entities', 'entity encoder', 'escape html', 'html special chars'],
    instructions: ['Type text to convert reserved characters into &amp;, &lt;, etc.'],
    relatedTools: ['html-entity-decoder', 'html-formatter'],
    component: HtmlEntityEncoder
  },
  {
    id: 'html-entity-decoder',
    name: 'HTML Entity Decoder',
    shortDescription: 'Convert HTML entities (&amp;, &quot;, &#39;) back into standard UTF-8 characters.',
    category: 'developer',
    iconName: 'FileCheck',
    keywords: ['html entity decoder', 'unescape html', 'decode entities'],
    instructions: ['Paste entity-encoded text to convert back to normal characters.'],
    relatedTools: ['html-entity-encoder', 'html-to-text'],
    component: HtmlEntityDecoder
  },
  {
    id: 'timestamp-converter',
    name: 'Timestamp Converter',
    shortDescription: 'Convert Unix epoch timestamps (seconds & milliseconds) to human-readable dates and UTC.',
    category: 'developer',
    iconName: 'CalendarClock',
    keywords: ['timestamp converter', 'unix time', 'epoch converter', 'utc date', 'unix seconds'],
    isPopular: true,
    instructions: ['Enter a Unix timestamp or pick a calendar date.', 'Converts between Epoch, ISO 8601, and local time.'],
    relatedTools: ['date-difference-calculator', 'time-converter'],
    component: TimestampConverter
  },
  {
    id: 'color-code-converter',
    name: 'Color Code Converter',
    shortDescription: 'Convert colors between HEX, RGB, HSL, HSV, and CMYK formats with visual swatch.',
    category: 'developer',
    iconName: 'Pipette',
    keywords: ['color converter', 'hex to rgb', 'rgb to hsl', 'cmyk', 'color picker'],
    isPopular: true,
    instructions: ['Enter any color format (HEX, RGB, or HSL).', 'All color spaces update in real time.'],
    relatedTools: ['css-gradient-generator', 'color-palette-generator', 'image-color-picker'],
    component: ColorCodeConverter
  },
  {
    id: 'css-gradient-generator',
    name: 'CSS Gradient Generator',
    shortDescription: 'Design linear and radial CSS gradients visually with color stops and copy CSS code.',
    category: 'developer',
    iconName: 'Sparkles',
    keywords: ['css gradient', 'gradient generator', 'linear gradient', 'radial gradient', 'css background'],
    instructions: ['Adjust gradient angle, color stops, and positions.', 'Copy generated CSS rule.'],
    relatedTools: ['color-code-converter', 'color-palette-generator'],
    component: CssGradientGenerator
  },
  {
    id: 'meta-tag-generator',
    name: 'Meta Tag Generator',
    shortDescription: 'Generate complete HTML SEO meta tags, Open Graph (OG), and Twitter Card markup.',
    category: 'developer',
    iconName: 'Tag',
    keywords: ['meta tags', 'seo generator', 'open graph', 'og tags', 'twitter card'],
    isPopular: true,
    instructions: ['Enter website title, description, URL, and social share image URL.', 'Copy generated head meta tags.'],
    relatedTools: ['robots-txt-generator', 'sitemap-generator', 'slug-generator'],
    component: MetaTagGenerator
  },
  {
    id: 'robots-txt-generator',
    name: 'Robots.txt Generator',
    shortDescription: 'Create custom robots.txt files with crawl directives for Googlebot, Bingbot, and AI crawlers.',
    category: 'developer',
    iconName: 'Bot',
    keywords: ['robots txt', 'crawler rules', 'user-agent', 'seo robots', 'disallow'],
    instructions: ['Configure allow/disallow paths and crawl delay.', 'Add sitemap link and download robots.txt.'],
    relatedTools: ['sitemap-generator', 'meta-tag-generator'],
    component: RobotsTxtGenerator
  },
  {
    id: 'sitemap-generator',
    name: 'Sitemap Generator',
    shortDescription: 'Create clean, compliant XML sitemaps for search engines with changefreq and priority.',
    category: 'developer',
    iconName: 'Network',
    keywords: ['sitemap generator', 'xml sitemap', 'seo sitemap', 'google sitemap'],
    instructions: ['Add your website URLs, change frequency, and priority values.', 'Export sitemap.xml.'],
    relatedTools: ['robots-txt-generator', 'meta-tag-generator'],
    component: SitemapGenerator
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    shortDescription: 'Generate customizable high-resolution QR codes with instant PNG and SVG export.',
    category: 'developer',
    iconName: 'QrCode',
    keywords: ['qr code generator', 'make qr code', 'free qr', 'qr svg', 'qr png'],
    isPopular: true,
    instructions: ['Type or paste any URL, text, or data.', 'Customize color and error correction level.', 'Download PNG or SVG.'],
    relatedTools: ['url-qr-generator', 'wifi-qr-generator', 'qr-code-scanner'],
    component: QrCodeGenerator
  },

  // ==========================================
  // CATEGORY E: IMAGE TOOLS (15)
  // ==========================================
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    shortDescription: 'Resize photos to custom width and height with aspect ratio locking and high-quality canvas.',
    category: 'image',
    iconName: 'Maximize2',
    keywords: ['resize image', 'image dimensions', 'scale photo', 'photo resizer'],
    isPopular: true,
    instructions: ['Drop or select an image file.', 'Specify target width and height.', 'Download resized image.'],
    relatedTools: ['image-compressor', 'image-cropper'],
    component: ImageResizer
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    shortDescription: 'Reduce image file size in your browser with adjustable compression quality slider.',
    category: 'image',
    iconName: 'Shrink',
    keywords: ['compress image', 'reduce image size', 'optimize photo', 'shrink photo'],
    isPopular: true,
    instructions: ['Upload an image.', 'Adjust compression quality percentage.', 'Inspect byte savings and download.'],
    relatedTools: ['image-resizer', 'image-format-converter'],
    component: ImageCompressor
  },
  {
    id: 'image-cropper',
    name: 'Image Cropper',
    shortDescription: 'Crop images to standard aspect ratios (1:1, 16:9, 4:3) or custom freeform crop.',
    category: 'image',
    iconName: 'Crop',
    keywords: ['crop image', 'photo crop', 'cut image', 'aspect ratio crop'],
    isPopular: true,
    instructions: ['Upload photo.', 'Drag the crop frame or pick a preset aspect ratio.', 'Save cropped image.'],
    relatedTools: ['image-resizer', 'image-rotator'],
    component: ImageCropper
  },
  {
    id: 'image-format-converter',
    name: 'Image Format Converter',
    shortDescription: 'Convert between JPG, PNG, WebP, GIF, and BMP formats 100% locally in browser.',
    category: 'image',
    iconName: 'FileType2',
    keywords: ['convert image', 'format converter', 'png to jpg', 'webp converter'],
    isPopular: true,
    instructions: ['Select an image in any format.', 'Choose target output format and download.'],
    relatedTools: ['jpg-to-png', 'png-to-jpg', 'webp-converter'],
    component: ImageFormatConverter
  },
  {
    id: 'jpg-to-png',
    name: 'JPG to PNG',
    shortDescription: 'Convert JPEG and JPG images to lossless PNG format with transparent alpha support.',
    category: 'image',
    iconName: 'FileImage',
    keywords: ['jpg to png', 'jpeg to png', 'convert jpg', 'lossless png'],
    instructions: ['Upload JPG file.', 'Download converted high-fidelity PNG image.'],
    relatedTools: ['png-to-jpg', 'webp-converter'],
    component: JpgToPng
  },
  {
    id: 'png-to-jpg',
    name: 'PNG to JPG',
    shortDescription: 'Convert PNG images to compact JPG format with customizable background color.',
    category: 'image',
    iconName: 'FileImage',
    keywords: ['png to jpg', 'convert png', 'flatten png', 'png to jpeg'],
    instructions: ['Upload PNG file.', 'Choose background fill for transparent areas and download JPG.'],
    relatedTools: ['jpg-to-png', 'image-compressor'],
    component: PngToJpg
  },
  {
    id: 'webp-converter',
    name: 'WebP Converter',
    shortDescription: 'Convert images to Google modern WebP format for fast web page loading.',
    category: 'image',
    iconName: 'FileCode2',
    keywords: ['webp converter', 'image to webp', 'modern image format', 'web photo'],
    isPopular: true,
    instructions: ['Upload JPG or PNG.', 'Export optimized WebP image.'],
    relatedTools: ['image-compressor', 'image-format-converter'],
    component: WebpConverter
  },
  {
    id: 'image-rotator',
    name: 'Image Rotator',
    shortDescription: 'Rotate images by 90°, 180°, 270°, or arbitrary degree angles with real-time preview.',
    category: 'image',
    iconName: 'RotateCw',
    keywords: ['rotate image', 'turn photo', 'rotate 90 degrees', 'straighten image'],
    instructions: ['Upload image.', 'Click rotation buttons or adjust custom slider.', 'Download rotated photo.'],
    relatedTools: ['image-flipper', 'image-cropper'],
    component: ImageRotator
  },
  {
    id: 'image-flipper',
    name: 'Image Flipper',
    shortDescription: 'Flip images horizontally (mirror effect) or vertically (upside down).',
    category: 'image',
    iconName: 'FlipHorizontal',
    keywords: ['flip image', 'mirror image', 'flip horizontal', 'flip vertical'],
    instructions: ['Upload image.', 'Select Flip Horizontal or Flip Vertical.'],
    relatedTools: ['image-rotator', 'image-cropper'],
    component: ImageFlipper
  },
  {
    id: 'image-color-picker',
    name: 'Image Color Picker',
    shortDescription: 'Pick exact colors from any uploaded image to get HEX, RGB, and HSL color values.',
    category: 'image',
    iconName: 'Pipette',
    keywords: ['color picker', 'image color', 'eyedropper', 'extract color from photo'],
    isPopular: true,
    instructions: ['Upload photo.', 'Hover and click any pixel to read its exact color code.'],
    relatedTools: ['color-code-converter', 'color-palette-generator'],
    component: ImageColorPicker
  },
  {
    id: 'image-metadata-viewer',
    name: 'Image Metadata Viewer',
    shortDescription: 'Inspect image file details: MIME type, dimensions, byte size, and EXIF attributes.',
    category: 'image',
    iconName: 'Info',
    keywords: ['image metadata', 'exif viewer', 'photo info', 'image details'],
    instructions: ['Upload photo to view client-side image header and metadata properties.'],
    relatedTools: ['image-dimensions-checker', 'image-color-picker'],
    component: ImageMetadataViewer
  },
  {
    id: 'image-dimensions-checker',
    name: 'Image Dimensions Checker',
    shortDescription: 'Quickly check natural pixel width, height, aspect ratio, and megapixels of any image.',
    category: 'image',
    iconName: 'ScanLine',
    keywords: ['image dimensions', 'photo resolution', 'check width height', 'megapixels'],
    instructions: ['Upload or drop image file to inspect resolution and aspect ratio.'],
    relatedTools: ['image-resizer', 'image-metadata-viewer'],
    component: ImageDimensionsChecker
  },
  {
    id: 'favicon-generator',
    name: 'Favicon Generator',
    shortDescription: 'Generate multi-size web favicons (16x16, 32x32, 48x48, 192x192, 512x512) and manifest icons.',
    category: 'image',
    iconName: 'Sparkles',
    keywords: ['favicon generator', 'website icon', 'favicon ico', 'apple touch icon'],
    isPopular: true,
    instructions: ['Upload square or logo image.', 'Instantly generate and download standard favicon sizes.'],
    relatedTools: ['image-resizer', 'meta-tag-generator'],
    component: FaviconGenerator
  },
  {
    id: 'image-to-base64',
    name: 'Image to Base64',
    shortDescription: 'Convert image files into Base64 data URI strings for embedding directly in HTML or CSS.',
    category: 'image',
    iconName: 'Binary',
    keywords: ['image to base64', 'data uri', 'inline image', 'base64 image'],
    isPopular: true,
    instructions: ['Upload image to generate data:image/...;base64 string.', 'Copy data URI or HTML img tag.'],
    relatedTools: ['base64-to-image', 'base64-encoder'],
    component: ImageToBase64
  },
  {
    id: 'base64-to-image',
    name: 'Base64 to Image',
    shortDescription: 'Decode Base64 data URI strings back into previewable and downloadable image files.',
    category: 'image',
    iconName: 'Image',
    keywords: ['base64 to image', 'decode data uri', 'base64 string to png'],
    instructions: ['Paste Base64 data URI string.', 'Preview image and download as file.'],
    relatedTools: ['image-to-base64', 'base64-decoder'],
    component: Base64ToImage
  },

  // ==========================================
  // CATEGORY F: QR & GENERATORS (15)
  // ==========================================
  {
    id: 'url-qr-generator',
    name: 'URL QR Generator',
    shortDescription: 'Create interactive branded QR codes for websites and links with custom center logo embedding, styling, and high-res vector export.',
    category: 'generators',
    iconName: 'Link',
    keywords: ['url qr', 'website qr code', 'link to qr', 'qr with logo', 'branded qr code', 'custom logo qr', 'web link qr'],
    isPopular: true,
    instructions: [
      'Enter destination website URL.',
      'Optionally upload your logo (PNG, JPG, WebP) to embed in the center of the QR code.',
      'Customize logo size, shape (square, circle, rounded), background, padding, and border.',
      'Adjust QR foreground/background colors and error correction level.',
      'Download standard PNG, print-ready 2048px high-resolution PNG, or vector SVG.'
    ],
    relatedTools: ['qr-code-generator', 'wifi-qr-generator', 'vcard-qr-generator'],
    component: UrlQrGenerator
  },
  {
    id: 'wifi-qr-generator',
    name: 'Wi-Fi QR Generator',
    shortDescription: 'Generate Wi-Fi connection QR codes that allow guests to connect instantly without typing passwords.',
    category: 'generators',
    iconName: 'Wifi',
    keywords: ['wifi qr code', 'connect to wifi qr', 'guest wifi qr', 'network qr'],
    isPopular: true,
    instructions: ['Enter Wi-Fi network SSID.', 'Enter Wi-Fi password and select security type (WPA/WPA2/WEP).', 'Print or download QR code.'],
    relatedTools: ['qr-code-generator', 'contact-qr-generator'],
    component: WifiQrGenerator
  },
  {
    id: 'contact-qr-generator',
    name: 'Contact QR Generator',
    shortDescription: 'Create scannable contact card QR codes containing name, phone, email, and organization.',
    category: 'generators',
    iconName: 'UserCheck',
    keywords: ['contact qr', 'meCard', 'vcard qr', 'business card qr'],
    instructions: ['Fill in contact fields.', 'Scanners automatically prompt to save contact to address book.'],
    relatedTools: ['vcard-qr-generator', 'phone-qr-generator'],
    component: ContactQrGenerator
  },
  {
    id: 'email-qr-generator',
    name: 'Email QR Generator',
    shortDescription: 'Generate QR codes that open pre-filled email messages with recipient, subject, and body.',
    category: 'generators',
    iconName: 'Mail',
    keywords: ['email qr', 'mail to qr', 'send email qr'],
    instructions: ['Enter destination email address.', 'Specify subject and pre-composed message body.'],
    relatedTools: ['contact-qr-generator', 'sms-qr-generator'],
    component: EmailQrGenerator
  },
  {
    id: 'phone-qr-generator',
    name: 'Phone QR Generator',
    shortDescription: 'Generate QR codes that initiate direct phone calls when scanned on mobile devices.',
    category: 'generators',
    iconName: 'PhoneCall',
    keywords: ['phone qr', 'call qr code', 'dial phone qr'],
    instructions: ['Enter phone number with international country code.'],
    relatedTools: ['sms-qr-generator', 'whatsapp-qr-generator'],
    component: PhoneQrGenerator
  },
  {
    id: 'sms-qr-generator',
    name: 'SMS QR Generator',
    shortDescription: 'Create QR codes that launch SMS text messaging apps with recipient and message filled.',
    category: 'generators',
    iconName: 'MessageSquare',
    keywords: ['sms qr', 'text message qr', 'send text qr'],
    instructions: ['Enter recipient phone number and default text message.'],
    relatedTools: ['phone-qr-generator', 'whatsapp-qr-generator'],
    component: SmsQrGenerator
  },
  {
    id: 'location-qr-generator',
    name: 'Location QR Generator',
    shortDescription: 'Generate QR codes that open specific map coordinates (Latitude/Longitude) in Google Maps.',
    category: 'generators',
    iconName: 'MapPin',
    keywords: ['location qr', 'maps qr code', 'coordinates qr', 'gps qr'],
    instructions: ['Enter latitude and longitude coordinates.'],
    relatedTools: ['url-qr-generator', 'contact-qr-generator'],
    component: LocationQrGenerator
  },
  {
    id: 'whatsapp-qr-generator',
    name: 'WhatsApp QR Generator',
    shortDescription: 'Generate direct WhatsApp chat QR codes with pre-filled greeting text.',
    category: 'generators',
    iconName: 'MessageCircle',
    keywords: ['whatsapp qr', 'wa link qr', 'chat qr', 'whatsapp direct'],
    isPopular: true,
    instructions: ['Enter international phone number.', 'Enter optional starter message.'],
    relatedTools: ['phone-qr-generator', 'sms-qr-generator'],
    component: WhatsappQrGenerator
  },
  {
    id: 'vcard-qr-generator',
    name: 'vCard QR Generator',
    shortDescription: 'Generate rich vCard 3.0 QR codes including street address, title, and website URLs.',
    category: 'generators',
    iconName: 'IdCard',
    keywords: ['vcard qr', 'digital business card', 'vcard 3.0', 'contact share'],
    instructions: ['Fill full personal or business details.', 'Download high-res QR for print business cards.'],
    relatedTools: ['contact-qr-generator', 'qr-code-generator'],
    component: VcardQrGenerator
  },
  {
    id: 'qr-code-scanner',
    name: 'QR Code Scanner',
    shortDescription: 'Scan QR codes in real-time using your device camera or by uploading an image file.',
    category: 'generators',
    iconName: 'Scan',
    keywords: ['qr code scanner', 'read qr code', 'scan qr camera', 'decode qr image'],
    isPopular: true,
    instructions: ['Click Start Camera to scan live, or drop a picture containing a QR code.'],
    relatedTools: ['qr-code-generator', 'url-qr-generator'],
    component: QrCodeScanner
  },
  {
    id: 'random-number-generator',
    name: 'Random Number Generator',
    shortDescription: 'Generate cryptographically random numbers within custom ranges, dice rolling, and coin flipping.',
    category: 'generators',
    iconName: 'Dices',
    keywords: ['random number generator', 'rng', 'roll dice', 'flip coin', 'random integer'],
    isPopular: true,
    instructions: ['Set minimum and maximum range.', 'Choose quantity and whether duplicates are allowed.'],
    relatedTools: ['random-password-generator', 'uuid-batch-generator'],
    component: RandomNumberGenerator
  },
  {
    id: 'random-password-generator',
    name: 'Random Password Generator',
    shortDescription: 'Generate secure multi-character passwords or memorable passphrases with entropy stats.',
    category: 'generators',
    iconName: 'KeyRound',
    keywords: ['random password generator', 'strong password', 'passphrase generator', 'diceware'],
    isPopular: true,
    instructions: ['Choose random character or passphrase mode.', 'Generate single or batch lists.'],
    relatedTools: ['password-generator', 'hash-generator'],
    component: RandomPasswordGenerator
  },
  {
    id: 'uuid-batch-generator',
    name: 'UUID Generator (Batch)',
    shortDescription: 'Batch generate Version 4 and Version 1 UUIDs with custom prefixes, quotes, and JSON export.',
    category: 'generators',
    iconName: 'Fingerprint',
    keywords: ['uuid generator', 'batch uuid', 'guid generator', 'bulk uuids'],
    instructions: ['Select quantity of UUIDs to generate (1-100).', 'Customize hyphens, casing, and export.'],
    relatedTools: ['uuid-generator', 'random-number-generator'],
    component: UuidGeneratorTool
  },
  {
    id: 'username-generator',
    name: 'Username Generator',
    shortDescription: 'Generate creative, gaming, tech, aesthetic, and professional social usernames.',
    category: 'generators',
    iconName: 'UserPlus',
    keywords: ['username generator', 'gamer tag', 'handle generator', 'social media handle', 'cool usernames'],
    isPopular: true,
    instructions: ['Select style persona (Gamer, Tech, Aesthetic, etc.).', 'Optionally enter a seed keyword.'],
    relatedTools: ['random-password-generator', 'slug-generator'],
    component: UsernameGenerator
  },
  {
    id: 'color-palette-generator',
    name: 'Color Palette Generator',
    shortDescription: 'Generate 5-color harmonic palettes (complementary, analogous, triadic) with color locking.',
    category: 'generators',
    iconName: 'Palette',
    keywords: ['color palette generator', 'color scheme', 'harmonic colors', 'css palette', 'coolors'],
    isPopular: true,
    instructions: ['Press Spacebar to randomize colors.', 'Lock colors you like.', 'Export as CSS or JSON.'],
    relatedTools: ['color-code-converter', 'css-gradient-generator', 'image-color-picker'],
    component: ColorPaletteGenerator
  },
  // ==========================================
  // CATEGORY: DAILY PRODUCTIVITY (15)
  // ==========================================
  {
    id: 'todo-list',
    name: 'To-Do List',
    shortDescription: 'Create, organize, and prioritize daily tasks with deadlines and local auto-saving.',
    category: 'productivity',
    iconName: 'CheckSquare',
    keywords: ['todo', 'task list', 'checklist', 'productivity', 'tasks', 'due date', 'priorities'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Add a new task with priority level and optional due date.',
      'Toggle checkmark to mark completed.',
      'Filter by status or export list as CSV/JSON.'
    ],
    relatedTools: ['checklist-maker', 'daily-planner', 'habit-tracker'],
    component: TodoList
  },
  {
    id: 'quick-notes',
    name: 'Quick Notes',
    shortDescription: 'Instant private notepad with word count, local autosave, and text file export.',
    category: 'productivity',
    iconName: 'FileText',
    keywords: ['quick notes', 'notepad', 'scratchpad', 'memo', 'jotting', 'text editor'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Click New Note to start jotting thoughts.',
      'Pin high-priority notes to stay on top.',
      'Download note as .txt or copy to clipboard.'
    ],
    relatedTools: ['sticky-notes', 'markdown-editor', 'todo-list'],
    component: QuickNotes
  },
  {
    id: 'sticky-notes',
    name: 'Sticky Notes',
    shortDescription: 'Visual multi-colored digital sticky note board with drag layout and instant browser saving.',
    category: 'productivity',
    iconName: 'StickyNote',
    keywords: ['sticky notes', 'post-it', 'colored notes', 'reminders', 'pinboard'],
    offlineAvailable: true,
    instructions: [
      'Click Add Note to pin a new colored note.',
      'Pick from 6 vibrant color themes.',
      'Edit text inline with automatic local persistence.'
    ],
    relatedTools: ['quick-notes', 'daily-planner', 'checklist-maker'],
    component: StickyNotes
  },
  {
    id: 'daily-planner',
    name: 'Daily Planner',
    shortDescription: 'Structure your day with hourly time blocks, top 3 priorities, and printable daily agenda.',
    category: 'productivity',
    iconName: 'Calendar',
    keywords: ['daily planner', 'time blocking', 'day agenda', 'schedule', 'daily routine'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Choose planning date.',
      'Write down your top 3 non-negotiable daily priorities.',
      'Assign activities to hourly time blocks and print.'
    ],
    relatedTools: ['weekly-planner', 'todo-list', 'pomodoro-timer'],
    component: DailyPlanner
  },
  {
    id: 'weekly-planner',
    name: 'Weekly Planner',
    shortDescription: 'Organize your weekly deliverables, day-by-day task lists, and main weekly goals.',
    category: 'productivity',
    iconName: 'CalendarDays',
    keywords: ['weekly planner', 'week schedule', 'sprint plan', '7 day planner'],
    offlineAvailable: true,
    instructions: [
      'Define your main weekly objective.',
      'Add specific actionable tasks under each day column.',
      'Print or review your schedule throughout the week.'
    ],
    relatedTools: ['daily-planner', 'goal-tracker', 'study-planner'],
    component: WeeklyPlanner
  },
  {
    id: 'habit-tracker',
    name: 'Habit Tracker',
    shortDescription: 'Track recurring daily habits, build streaks, and visualize weekly consistency.',
    category: 'productivity',
    iconName: 'Flame',
    keywords: ['habit tracker', 'streak', 'routine', 'daily habits', 'consistency', 'discipline'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Add daily habits you want to cultivate.',
      'Tap day checkmarks to record completion.',
      'Monitor your streaks and consistency percentage.'
    ],
    relatedTools: ['daily-planner', 'goal-tracker', 'reading-tracker'],
    component: HabitTracker
  },
  {
    id: 'pomodoro-timer',
    name: 'Pomodoro Timer',
    shortDescription: 'Boost focus with customizable 25-minute Pomodoro intervals, short/long breaks, and audio chimes.',
    category: 'productivity',
    iconName: 'Timer',
    keywords: ['pomodoro timer', 'focus timer', 'productivity technique', '25 minute timer', 'study timer'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Click Start Focus to begin 25-minute work block.',
      'Take 5-minute break when chime sounds.',
      'Enjoy a 15-minute long break every 4 cycles.'
    ],
    relatedTools: ['countdown-timer', 'stopwatch', 'study-planner'],
    component: PomodoroTimer
  },
  {
    id: 'stopwatch',
    name: 'Stopwatch',
    shortDescription: 'Millisecond-precision stopwatch with lap splits, fastest/slowest lap detection, and CSV export.',
    category: 'productivity',
    iconName: 'Watch',
    keywords: ['stopwatch', 'timer', 'lap timer', 'split timer', 'chronometer'],
    offlineAvailable: true,
    instructions: [
      'Press Start to initiate high-precision timing.',
      'Press Lap to record interval splits.',
      'Export all recorded laps to CSV for analysis.'
    ],
    relatedTools: ['countdown-timer', 'pomodoro-timer', 'time-duration-calculator'],
    component: StopwatchTool
  },
  {
    id: 'countdown-timer',
    name: 'Countdown Timer',
    shortDescription: 'Custom multi-hour countdown timer with audio chime alerts, progress ring, and quick presets.',
    category: 'productivity',
    iconName: 'Hourglass',
    keywords: ['countdown timer', 'timer', 'alarm', 'cooking timer', 'interval countdown'],
    offlineAvailable: true,
    instructions: [
      'Set custom hours, minutes, and seconds or choose a preset.',
      'Click Start to begin countdown.',
      'Synthesized chime sounds upon zero.'
    ],
    relatedTools: ['pomodoro-timer', 'stopwatch', 'cooking-timer'],
    component: CountdownTimer
  },
  {
    id: 'world-clock',
    name: 'World Clock',
    shortDescription: 'Real-time multi-timezone world clock dashboard with day/night status and 12/24h formats.',
    category: 'productivity',
    iconName: 'Globe',
    keywords: ['world clock', 'time zones', 'international time', 'utc', 'gmt', 'global clock'],
    offlineAvailable: true,
    instructions: [
      'Select and add major global cities to your board.',
      'Toggle between 12-hour and 24-hour time.',
      'Observe daytime/nighttime indicators in real time.'
    ],
    relatedTools: ['meeting-planner', 'timestamp-converter', 'time-converter'],
    component: WorldClock
  },
  {
    id: 'meeting-planner',
    name: 'Meeting Planner',
    shortDescription: 'Plan cross-timezone meetings, calculate participant local times, and generate .ics calendar invites.',
    category: 'productivity',
    iconName: 'Users',
    keywords: ['meeting planner', 'timezone meeting', 'schedule meeting', 'calendar invite', 'ics'],
    offlineAvailable: true,
    instructions: [
      'Set meeting date, time, and your base timezone.',
      'Add participant locations to view local time conversion.',
      'Download ready-to-import .ics calendar invite.'
    ],
    relatedTools: ['world-clock', 'weekly-planner', 'daily-planner'],
    component: MeetingPlanner
  },
  {
    id: 'goal-tracker',
    name: 'Goal Tracker',
    shortDescription: 'Track high-level SMART goals with key milestone checklists, target dates, and progress bars.',
    category: 'productivity',
    iconName: 'Trophy',
    keywords: ['goal tracker', 'smart goals', 'milestones', 'targets', 'achievement'],
    offlineAvailable: true,
    instructions: [
      'Define your primary goal and target completion date.',
      'Break goal into sub-milestones.',
      'Check off milestones as completed to advance progress.'
    ],
    relatedTools: ['habit-tracker', 'todo-list', 'weekly-planner'],
    component: GoalTracker
  },
  {
    id: 'checklist-maker',
    name: 'Checklist Maker',
    shortDescription: 'Build structured task checklists with completion tracking and one-click Markdown export.',
    category: 'productivity',
    iconName: 'ListChecks',
    keywords: ['checklist maker', 'checklist', 'markdown checklist', 'steps', 'process list'],
    offlineAvailable: true,
    instructions: [
      'Name your checklist and add items.',
      'Check off items as steps are finished.',
      'Export checklist as GitHub-flavored Markdown.'
    ],
    relatedTools: ['todo-list', 'sticky-notes', 'daily-planner'],
    component: ChecklistMaker
  },
  {
    id: 'reading-tracker',
    name: 'Reading Tracker',
    shortDescription: 'Track book reading progress, pages read, reading status, and personal book reviews.',
    category: 'productivity',
    iconName: 'BookOpen',
    keywords: ['reading tracker', 'books', 'reading list', 'goodreads alternative', 'pages read'],
    offlineAvailable: true,
    instructions: [
      'Add books with title, author, and total page count.',
      'Update your current page number after reading sessions.',
      'Track total pages read and library completion rate.'
    ],
    relatedTools: ['study-planner', 'habit-tracker', 'goal-tracker'],
    component: ReadingTracker
  },
  {
    id: 'study-planner',
    name: 'Study Planner',
    shortDescription: 'Organize study hours per subject, track syllabus topics, and countdown to exams.',
    category: 'productivity',
    iconName: 'GraduationCap',
    keywords: ['study planner', 'exam prep', 'study schedule', 'revision planner', 'course tracker'],
    offlineAvailable: true,
    instructions: [
      'Add your enrolled courses and target study hours.',
      'Log completed study sessions (+1h, +2h).',
      'Track syllabus progress leading up to exam date.'
    ],
    relatedTools: ['pomodoro-timer', 'reading-tracker', 'todo-list'],
    component: StudyPlanner
  },
  // ==========================================
  // CATEGORY: PERSONAL FINANCE (15)
  // ==========================================
  {
    id: 'daily-expense-tracker',
    name: 'Daily Expense Tracker',
    shortDescription: 'Log daily personal expenditures by category with payment mode tracking and CSV export.',
    category: 'finance',
    iconName: 'Receipt',
    keywords: ['expense tracker', 'daily expenses', 'spending', 'money tracker', 'budgeting', 'inr'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Enter expense title, amount, category, and payment mode.',
      'Filter transactions by category or date.',
      'Export all logged expenses to CSV.'
    ],
    relatedTools: ['monthly-budget-planner', 'monthly-expense-summary', 'income-tracker'],
    component: DailyExpenseTracker
  },
  {
    id: 'monthly-budget-planner',
    name: 'Monthly Budget Planner',
    shortDescription: 'Plan monthly budgets with the 50/30/20 rule, track actual variance, and avoid overspending.',
    category: 'finance',
    iconName: 'Wallet',
    keywords: ['monthly budget', 'budget planner', '50 30 20 budget', 'financial planning', 'budget variance'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Enter your monthly net income.',
      'Customize category limits for Needs, Wants, and Savings.',
      'Update actual spends to evaluate your 50/30/20 balance.'
    ],
    relatedTools: ['daily-expense-tracker', 'savings-goal-calculator', 'monthly-expense-summary'],
    component: MonthlyBudgetPlanner
  },
  {
    id: 'savings-goal-calculator',
    name: 'Savings Goal Calculator',
    shortDescription: 'Calculate required monthly contributions and compounding returns to achieve your savings target.',
    category: 'finance',
    iconName: 'PiggyBank',
    keywords: ['savings goal calculator', 'target savings', 'sip calculator', 'future goal', 'wealth planning'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Enter target goal amount and time horizon in months.',
      'Set expected annual return rate for mutual funds or fixed deposits.',
      'Review required monthly contribution and compound interest bonus.'
    ],
    relatedTools: ['savings-tracker', 'monthly-budget-planner', 'compound-interest-calculator'],
    component: SavingsGoalCalculator
  },
  {
    id: 'savings-tracker',
    name: 'Savings Tracker',
    shortDescription: 'Manage multiple savings pots (Emergency Fund, Vacation, Gadgets) with deposit logs.',
    category: 'finance',
    iconName: 'TrendingUp',
    keywords: ['savings tracker', 'savings pots', 'sinking funds', 'emergency fund', 'vaults'],
    offlineAvailable: true,
    instructions: [
      'Create custom savings pots with target goals.',
      'Log deposits and withdrawals as you save money.',
      'Track visual progress bars toward each milestone.'
    ],
    relatedTools: ['savings-goal-calculator', 'daily-expense-tracker', 'income-tracker'],
    component: SavingsTracker
  },
  {
    id: 'income-tracker',
    name: 'Income Tracker',
    shortDescription: 'Track multiple income streams, freelance revenues, and annual run rate projections.',
    category: 'finance',
    iconName: 'Coins',
    keywords: ['income tracker', 'salary', 'freelance earnings', 'revenue', 'multiple income streams'],
    offlineAvailable: true,
    instructions: [
      'Add primary job, freelance, rental, or dividend income sources.',
      'Specify payment frequency (Monthly, Bi-weekly, Annual).',
      'Analyze normalized monthly and projected annual cash inflows.'
    ],
    relatedTools: ['monthly-budget-planner', 'daily-expense-tracker', 'salary-calculator'],
    component: IncomeTracker
  },
  {
    id: 'expense-splitter',
    name: 'Expense Splitter',
    shortDescription: 'Split group trip or flatmate bills with automated minimum debt settlement transactions.',
    category: 'finance',
    iconName: 'Users',
    keywords: ['expense splitter', 'splitwise alternative', 'bill splitter', 'group expenses', 'share costs'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Add group member names (friends, flatmates).',
      'Log shared expenses and who paid.',
      'Copy the simplified "who pays whom" debt settlement plan.'
    ],
    relatedTools: ['split-bill-calculator', 'daily-expense-tracker', 'shopping-budget-calculator'],
    component: ExpenseSplitter
  },
  {
    id: 'subscription-tracker',
    name: 'Subscription Tracker',
    shortDescription: 'Monitor recurring streaming and software subscriptions, renewal dates, and annual commitments.',
    category: 'finance',
    iconName: 'CreditCard',
    keywords: ['subscription tracker', 'recurring bills', 'netflix spotify', 'renewals', 'monthly subscriptions'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Add active subscriptions with cost, cycle, and renewal day.',
      'Review total monthly drain and yearly commitment.',
      'Export subscription list to CSV.'
    ],
    relatedTools: ['bill-reminder', 'monthly-budget-planner', 'daily-expense-tracker'],
    component: SubscriptionTracker
  },
  {
    id: 'bill-reminder',
    name: 'Bill Reminder',
    shortDescription: 'Track utility, rent, and card payment due dates with urgency alerts and paid status toggles.',
    category: 'finance',
    iconName: 'Bell',
    keywords: ['bill reminder', 'due date', 'utility bills', 'rent due', 'payment reminder'],
    offlineAvailable: true,
    instructions: [
      'Add recurring bills with due dates and amounts.',
      'Check overdue and due-soon status highlights.',
      'Mark bills as paid once settled.'
    ],
    relatedTools: ['subscription-tracker', 'daily-expense-tracker', 'monthly-budget-planner'],
    component: BillReminder
  },
  {
    id: 'shopping-budget-calculator',
    name: 'Shopping Budget Calculator',
    shortDescription: 'Tally cart items with discounts, sales tax/GST, and enforce strict shopping budget ceilings.',
    category: 'finance',
    iconName: 'ShoppingCart',
    keywords: ['shopping budget', 'cart calculator', 'shopping list with prices', 'sales discount', 'gst calculator'],
    offlineAvailable: true,
    instructions: [
      'Set target shopping budget limit.',
      'Add items with prices, quantities, and discount percentages.',
      'Watch real-time remaining budget and over-budget warnings.'
    ],
    relatedTools: ['price-comparison-calculator', 'unit-price-calculator', 'discount-calculator'],
    component: ShoppingBudgetCalculator
  },
  {
    id: 'price-comparison-calculator',
    name: 'Price Comparison Calculator',
    shortDescription: 'Compare up to 6 product package variants to find the true lowest cost per weight or volume.',
    category: 'finance',
    iconName: 'Scale',
    keywords: ['price comparison', 'best value', 'bulk deal compare', 'cost per gram', 'deal finder'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Enter price and quantity for package options A, B, C.',
      'The calculator computes unit prices and crowns the Best Value deal.',
      'Reveals percentage savings compared to other options.'
    ],
    relatedTools: ['unit-price-calculator', 'shopping-budget-calculator', 'discount-calculator'],
    component: PriceComparisonCalculator
  },
  {
    id: 'unit-price-calculator',
    name: 'Unit Price Calculator',
    shortDescription: 'Calculate and compare exact cost per kg, gram, liter, or piece across different packages.',
    category: 'finance',
    iconName: 'Calculator',
    keywords: ['unit price calculator', 'cost per kg', 'cost per liter', 'package comparison', 'grocery math'],
    offlineAvailable: true,
    instructions: [
      'Enter total price and quantity for Package A and Package B.',
      'Select unit types (e.g., 750g vs 1.2kg).',
      'Get standard normalized cost per kg or liter with savings percentage.'
    ],
    relatedTools: ['price-comparison-calculator', 'shopping-budget-calculator', 'ratio-calculator'],
    component: UnitPriceCalculator
  },
  {
    id: 'currency-denomination-calculator',
    name: 'Currency Denomination Calculator',
    shortDescription: 'Count Indian Rupee cash notes (₹2000 to ₹1) with automatic amount in words converter.',
    category: 'finance',
    iconName: 'Banknote',
    keywords: ['currency denomination calculator', 'cash counter inr', 'rupee denominations', 'amount in words', 'bank deposit'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Enter the quantity of each note or coin denomination.',
      'View instant total cash tally and total piece count.',
      'Copy bank deposit slip summary with Amount in Words.'
    ],
    relatedTools: ['cash-counter', 'change-calculator', 'gst-calculator'],
    component: CurrencyDenominationCalculator
  },
  {
    id: 'cash-counter',
    name: 'Cash Counter',
    shortDescription: 'Reconcile retail cash register drawers with opening float deduction and variance detection.',
    category: 'finance',
    iconName: 'Coins',
    keywords: ['cash counter', 'register reconciliation', 'drawer count', 'cash float', 'retail register'],
    offlineAvailable: true,
    instructions: [
      'Enter opening float and expected register cash.',
      'Tally counted notes and coins.',
      'Check surplus or shortage variance and copy register log.'
    ],
    relatedTools: ['currency-denomination-calculator', 'change-calculator', 'profit-loss-calculator'],
    component: CashCounter
  },
  {
    id: 'change-calculator',
    name: 'Change Calculator',
    shortDescription: 'Calculate customer change due with optimal currency denomination breakdown for cashiers.',
    category: 'finance',
    iconName: 'ArrowRightLeft',
    keywords: ['change calculator', 'cashier change', 'return change', 'optimal change notes', 'retail change'],
    offlineAvailable: true,
    instructions: [
      'Enter total bill amount and cash tendered by customer.',
      'Review exact change due or shortage.',
      'View optimal notes and coins to return to the customer.'
    ],
    relatedTools: ['currency-denomination-calculator', 'cash-counter', 'tip-calculator'],
    component: ChangeCalculator
  },
  {
    id: 'monthly-expense-summary',
    name: 'Monthly Expense Summary',
    shortDescription: 'Analyze monthly financial outflow, category distributions, and daily spending averages.',
    category: 'finance',
    iconName: 'PieChart',
    keywords: ['monthly expense summary', 'spending report', 'expense analytics', 'financial summary', 'csv export'],
    offlineAvailable: true,
    instructions: [
      'Select any calendar month to inspect logged receipts.',
      'Review category percentage distribution bars.',
      'Export detailed monthly spending statement to CSV.'
    ],
    relatedTools: ['daily-expense-tracker', 'monthly-budget-planner', 'income-tracker'],
    component: MonthlyExpenseSummary
  },

  // ==========================================
  // CATEGORY I: DATE & TIME (10)
  // ==========================================
  {
    id: 'calendar-generator',
    name: 'Calendar Generator',
    shortDescription: 'Generate custom printable monthly and yearly calendars with highlightable notes.',
    category: 'datetime',
    iconName: 'CalendarRange',
    keywords: ['calendar generator', 'printable calendar', 'custom calendar', 'month planner', 'print calendar'],
    offlineAvailable: true,
    instructions: [
      'Choose year, month, and whether Monday or Sunday starts the week.',
      'Add key notes or events directly to individual calendar days.',
      'Print or save directly using browser print styling.'
    ],
    relatedTools: ['monthly-calendar', 'yearly-calendar', 'date-to-day-finder'],
    component: CalendarGenerator
  },
  {
    id: 'monthly-calendar',
    name: 'Monthly Calendar',
    shortDescription: 'Interactive monthly organizer to schedule tasks, track events, and manage deadlines.',
    category: 'datetime',
    iconName: 'Calendar',
    keywords: ['monthly calendar', 'event planner', 'interactive calendar', 'schedule', 'appointments'],
    offlineAvailable: true,
    instructions: [
      'Click on any day in the month to create or view scheduled events.',
      'Color code items by personal, work, urgent, or holiday categories.',
      'Navigate backwards and forwards across any month.'
    ],
    relatedTools: ['calendar-generator', 'event-countdown', 'daily-planner'],
    component: MonthlyCalendar
  },
  {
    id: 'yearly-calendar',
    name: 'Yearly Calendar',
    shortDescription: 'Full 12-month high-level overview calendar for long-term planning and quick reference.',
    category: 'datetime',
    iconName: 'CalendarDays',
    keywords: ['yearly calendar', 'annual calendar', '12 month view', 'year at a glance'],
    offlineAvailable: true,
    instructions: [
      'Browse all 12 months on a single high-density screen.',
      'Adjust the year using previous and next controls.',
      'Today is clearly highlighted with an amber halo indicator.'
    ],
    relatedTools: ['monthly-calendar', 'calendar-generator', 'date-difference-calculator'],
    component: YearlyCalendar
  },
  {
    id: 'date-to-day-finder',
    name: 'Date to Day Finder',
    shortDescription: 'Instantly find the day of the week (Monday - Sunday) and leap year status for any date in history.',
    category: 'datetime',
    iconName: 'CalendarCheck',
    keywords: ['date to day', 'day of week', 'what day was it', 'leap year finder', 'day of the year'],
    offlineAvailable: true,
    instructions: [
      'Enter any past, present, or future calendar date.',
      'View the exact day of the week (e.g. Wednesday).',
      'Inspect day number of the year, ISO week number, and leap year classification.'
    ],
    relatedTools: ['age-calculator', 'birthday-countdown', 'days-between-dates'],
    component: DateToDayFinder
  },
  {
    id: 'birthday-countdown',
    name: 'Birthday Countdown',
    shortDescription: 'Track how many days, hours, and minutes remain until your next birthday milestone.',
    category: 'datetime',
    iconName: 'Cake',
    keywords: ['birthday countdown', 'days until birthday', 'turning age', 'next birthday tracker'],
    offlineAvailable: true,
    instructions: [
      'Enter your birth date in the input field.',
      'Watch live ticking countdown days, hours, minutes, and seconds.',
      'Check which milestone age you will be celebrating next.'
    ],
    relatedTools: ['age-calculator', 'event-countdown', 'countdown-timer'],
    component: BirthdayCountdown
  },
  {
    id: 'event-countdown',
    name: 'Event Countdown',
    shortDescription: 'Track multiple deadlines, product releases, vacations, and celebrations with live counters.',
    category: 'datetime',
    iconName: 'Clock',
    keywords: ['event countdown', 'deadline tracker', 'countdown timer', 'days until event'],
    offlineAvailable: true,
    instructions: [
      'Add target events with date, time, and custom categories.',
      'Inspect live countdown cards with real-time second updates.',
      'Copy formatted event countdown text to your clipboard.'
    ],
    relatedTools: ['birthday-countdown', 'countdown-timer', 'monthly-calendar'],
    component: EventCountdown
  },
  {
    id: 'timezone-meeting-planner',
    name: 'Timezone Meeting Planner',
    shortDescription: 'Coordinate global meetings across multiple time zones without awkward late-night calls.',
    category: 'datetime',
    iconName: 'Globe',
    keywords: ['timezone meeting planner', 'world clock meeting', 'global team schedule', 'time zone converter'],
    offlineAvailable: true,
    instructions: [
      'Select participant cities and global time zones.',
      'Drag the 24-hour slider to preview simultaneous local times.',
      'Green badges indicate comfortable standard business hours (9 AM – 6 PM).'
    ],
    relatedTools: ['world-clock', 'meeting-planner', 'shift-time-calculator'],
    component: TimezoneMeetingPlanner
  },
  {
    id: 'working-hours-tracker',
    name: 'Working Hours Tracker',
    shortDescription: 'Log daily timesheets, punch in/out, monitor breaks & overtime, and export to CSV.',
    category: 'datetime',
    iconName: 'Timer',
    keywords: ['working hours tracker', 'timesheet calculator', 'overtime calculator', 'punch clock', 'billable hours'],
    offlineAvailable: true,
    instructions: [
      'Log work shift start, end, and unpaid break duration.',
      'Or use the live "Punch In Now" button to clock in real time.',
      'View accumulated net hours, overtime, and estimated earnings.'
    ],
    relatedTools: ['shift-time-calculator', 'daily-planner', 'income-tracker'],
    component: WorkingHoursTracker
  },
  {
    id: 'shift-time-calculator',
    name: 'Shift Time Calculator',
    shortDescription: 'Calculate clock-out times including breaks and generate 4-week rotating shift schedules.',
    category: 'datetime',
    iconName: 'Moon',
    keywords: ['shift time calculator', 'clock out time', 'rotating shifts', '4 on 4 off', 'night shift'],
    offlineAvailable: true,
    instructions: [
      'Enter shift start time, shift duration, and unpaid break length.',
      'Check exact departure time, including overnight (+1 day) shifts.',
      'Plan 4-week rotating shift patterns like 4-on-4-off.'
    ],
    relatedTools: ['working-hours-tracker', 'sleep-schedule-planner', 'countdown-timer'],
    component: ShiftTimeCalculator
  },
  {
    id: 'sleep-schedule-planner',
    name: 'Sleep Schedule Planner',
    shortDescription: 'Optimize bedtimes and wake times with 90-minute REM sleep cycles to prevent sleep inertia.',
    category: 'datetime',
    iconName: 'Bed',
    keywords: ['sleep schedule planner', 'sleep cycle calculator', 'rem sleep', 'bedtime calculator', 'power nap'],
    offlineAvailable: true,
    instructions: [
      'Select desired wake-up time or calculate wake times for sleeping right now.',
      'Choose from optimal 5 or 6 cycle options (7.5 to 9 hours of restorative sleep).',
      'Use the Power Nap tab for 20-minute alertness boosts.'
    ],
    relatedTools: ['shift-time-calculator', 'pomodoro-timer', 'world-clock'],
    component: SleepSchedulePlanner
  },

  // ==========================================
  // CATEGORY J: STUDENT & EDUCATION (15)
  // ==========================================
  {
    id: 'cgpa-calculator',
    name: 'CGPA Calculator',
    shortDescription: 'Calculate Cumulative Grade Point Average across college semesters and course credits.',
    category: 'education',
    iconName: 'GraduationCap',
    keywords: ['cgpa calculator', 'cumulative gpa', 'semester credits', 'college gpa', 'university grades'],
    offlineAvailable: true,
    instructions: [
      'Choose between 10-point and 4-point grading scales.',
      'Enter SGPA and total credits earned per semester.',
      'View cumulative CGPA and equivalent percentage estimate.'
    ],
    relatedTools: ['sgpa-calculator', 'percentage-to-cgpa-converter', 'grade-calculator'],
    component: CgpaCalculator
  },
  {
    id: 'sgpa-calculator',
    name: 'SGPA Calculator',
    shortDescription: 'Calculate Semester Grade Point Average from course credits and letter or numerical grades.',
    category: 'education',
    iconName: 'Award',
    keywords: ['sgpa calculator', 'semester grade point average', 'course credits', 'grade points'],
    offlineAvailable: true,
    instructions: [
      'Enter course names and respective credit hours.',
      'Select letter grades awarded (O, A+, A, B+, B, C, P, F).',
      'Check semester SGPA and academic standing classification.'
    ],
    relatedTools: ['cgpa-calculator', 'grade-calculator', 'marks-calculator'],
    component: SgpaCalculator
  },
  {
    id: 'percentage-to-cgpa-converter',
    name: 'Percentage to CGPA Converter',
    shortDescription: 'Convert marks percentage to CGPA and vice versa using CBSE, VTU, Mumbai Univ, and 4.0 scales.',
    category: 'education',
    iconName: 'ArrowRightLeft',
    keywords: ['percentage to cgpa', 'cgpa to percentage', 'cbse 9.5 converter', 'vtu formula', 'gpa converter'],
    offlineAvailable: true,
    instructions: [
      'Toggle between CGPA to Percentage or Percentage to CGPA.',
      'Select board or university grading formula (CBSE, VTU, Mumbai Univ, US 4.0).',
      'Instant real-time conversion and reference lookup table.'
    ],
    relatedTools: ['cgpa-calculator', 'marks-calculator', 'percentage-calculator'],
    component: PercentageToCgpaConverter
  },
  {
    id: 'marks-calculator',
    name: 'Marks Calculator',
    shortDescription: 'Aggregate scored marks across subjects, compute total percentage, class division, and top subjects.',
    category: 'education',
    iconName: 'Trophy',
    keywords: ['marks calculator', 'total marks', 'percentage calculator', 'exam division', 'result calculation'],
    offlineAvailable: true,
    instructions: [
      'Input subject names, maximum marks, and scored marks.',
      'Review aggregate percentage, passing status, and division honors.',
      'Adjust the passing percentage cutoff as per your board rules.'
    ],
    relatedTools: ['percentage-calculator', 'cgpa-calculator', 'grade-calculator'],
    component: MarksCalculator
  },
  {
    id: 'grade-calculator',
    name: 'Grade Calculator',
    shortDescription: 'Calculate weighted class grades and determine scores needed on final exams for target goals.',
    category: 'education',
    iconName: 'Calculator',
    keywords: ['grade calculator', 'weighted grade', 'final exam grade needed', 'course grade'],
    offlineAvailable: true,
    instructions: [
      'Enter coursework components with their syllabus weight percentages.',
      'Input current scored grades on completed assignments and midterms.',
      'View current grade standing and minimum score needed on the final exam.'
    ],
    relatedTools: ['cgpa-calculator', 'marks-calculator', 'percentage-calculator'],
    component: GradeCalculator
  },
  {
    id: 'attendance-calculator',
    name: 'Attendance Calculator',
    shortDescription: 'Track total lectures delivered versus attended and check college attendance compliance.',
    category: 'education',
    iconName: 'CheckCircle2',
    keywords: ['attendance calculator', 'college attendance', 'attendance percentage', 'missed classes'],
    offlineAvailable: true,
    instructions: [
      'Enter total classes conducted and classes attended.',
      'Set your university minimum criteria (e.g. 75%).',
      'Visual gauge highlights compliance status and missed session counts.'
    ],
    relatedTools: ['attendance-shortage-calculator', 'study-session-tracker'],
    component: AttendanceCalculator
  },
  {
    id: 'attendance-shortage-calculator',
    name: 'Attendance Shortage Calculator',
    shortDescription: 'Calculate how many consecutive lectures you must attend to beat shortage or how many you can bunk.',
    category: 'education',
    iconName: 'AlertTriangle',
    keywords: ['attendance shortage', 'how many classes to attend', 'how many can i bunk', '75 attendance'],
    offlineAvailable: true,
    instructions: [
      'Input classes held and classes attended.',
      'Specify target threshold (e.g. 75% or 80%).',
      'Instantly discover exact consecutive lectures to attend or safe margin to miss.'
    ],
    relatedTools: ['attendance-calculator', 'timetable-generator'],
    component: AttendanceShortageCalculator
  },
  {
    id: 'study-session-tracker',
    name: 'Study Session Tracker',
    shortDescription: 'Log dedicated revision hours, rate focus quality, monitor subject dedication, and export history.',
    category: 'education',
    iconName: 'BookOpen',
    keywords: ['study session tracker', 'study hours log', 'study timer', 'focus tracker', 'learning log'],
    offlineAvailable: true,
    instructions: [
      'Log date, subject, topic, duration, and 5-star focus rating.',
      'View aggregated study hours and average session length.',
      'Export comprehensive study history to CSV for review.'
    ],
    relatedTools: ['pomodoro-timer', 'revision-planner', 'exam-countdown'],
    component: StudySessionTracker
  },
  {
    id: 'exam-countdown',
    name: 'Exam Countdown',
    shortDescription: 'Schedule upcoming examinations, track revision syllabus readiness, and monitor live countdowns.',
    category: 'education',
    iconName: 'Clock',
    keywords: ['exam countdown', 'exam timetable', 'days until exam', 'test countdown', 'syllabus checklist'],
    offlineAvailable: true,
    instructions: [
      'Add upcoming exam dates, subjects, venues, and revision notes.',
      'Toggle syllabus completion status per paper.',
      'Live ticking countdown cards organize papers in chronological order.'
    ],
    relatedTools: ['event-countdown', 'study-session-tracker', 'revision-planner'],
    component: ExamCountdown
  },
  {
    id: 'timetable-generator',
    name: 'Timetable Generator',
    shortDescription: 'Generate weekly class schedules and lecture timetables with color-coded subjects and print layouts.',
    category: 'education',
    iconName: 'Table',
    keywords: ['timetable generator', 'class timetable', 'lecture schedule', 'weekly schedule', 'print timetable'],
    offlineAvailable: true,
    instructions: [
      'Select days and time slots to assign classes, rooms, and lecturers.',
      'Color-code subjects for clean weekly overview.',
      'Click Print Timetable for a clean, border-optimized printable version.'
    ],
    relatedTools: ['daily-planner', 'weekly-planner', 'attendance-calculator'],
    component: TimetableGenerator
  },
  {
    id: 'flashcard-creator',
    name: 'Flashcard Creator',
    shortDescription: 'Build study decks, flip cards to test recall, shuffle concepts, and mark mastered topics.',
    category: 'education',
    iconName: 'HelpCircle',
    keywords: ['flashcard creator', 'study flashcards', 'active recall', 'anki deck', 'revision cards'],
    offlineAvailable: true,
    instructions: [
      'Create custom flashcard pairs (Front prompt / Back answer).',
      'Click anywhere on a card to flip and test memory recall.',
      'Shuffle the deck and mark mastered cards as you progress.'
    ],
    relatedTools: ['revision-planner', 'random-question-picker', 'study-session-tracker'],
    component: FlashcardCreator
  },
  {
    id: 'revision-planner',
    name: 'Revision Planner',
    shortDescription: 'Schedule scientifically spaced revision intervals (Day 1, 3, 7, 14, 30) to beat forgetting.',
    category: 'education',
    iconName: 'Sparkles',
    keywords: ['revision planner', 'spaced repetition', 'ebbinghaus forgetting curve', 'study intervals'],
    offlineAvailable: true,
    instructions: [
      'Enter newly learned subject topics and initial study date.',
      'System auto-generates 5 spaced review milestones (+1d, +3d, +7d, +14d, +30d).',
      'Mark off review intervals as you complete them.'
    ],
    relatedTools: ['flashcard-creator', 'study-session-tracker', 'exam-countdown'],
    component: RevisionPlanner
  },
  {
    id: 'random-question-picker',
    name: 'Random Question Picker',
    shortDescription: 'Conduct mock viva exams, test recall under pressure, and draw interview questions without repeats.',
    category: 'education',
    iconName: 'Dices',
    keywords: ['random question picker', 'mock viva', 'interview question picker', 'exam drill', 'question bank'],
    offlineAvailable: true,
    instructions: [
      'Paste your question bank or select preset science/CS questions.',
      'Click "Draw Next Question" to generate a randomized prompt.',
      'Enable "No-Repeat" to avoid drawing duplicate questions during drills.'
    ],
    relatedTools: ['flashcard-creator', 'revision-planner'],
    component: RandomQuestionPicker
  },
  {
    id: 'scientific-notation-converter',
    name: 'Scientific Notation Converter',
    shortDescription: 'Convert numbers between decimal, scientific notation, engineering notation, and SI prefixes.',
    category: 'education',
    iconName: 'Calculator',
    keywords: ['scientific notation', 'engineering notation', 'si prefix', 'powers of ten', 'standard form'],
    offlineAvailable: true,
    instructions: [
      'Type any decimal or scientific number (e.g. 299792458 or 6.022e23).',
      'View normalized scientific notation (a × 10^b).',
      'View engineering notation and matching SI metric prefixes (kilo, mega, micro, nano).'
    ],
    relatedTools: ['math-expression-evaluator', 'percentage-calculator'],
    component: ScientificNotationConverter
  },
  {
    id: 'math-expression-evaluator',
    name: 'Math Expression Evaluator',
    shortDescription: 'Evaluate mathematical expressions, powers, roots, trigonometric ratios, and logarithms with history.',
    category: 'education',
    iconName: 'DivideSquare',
    keywords: ['math expression evaluator', 'math calculator', 'scientific calculator', 'evaluate formula', 'arithmetic'],
    offlineAvailable: true,
    instructions: [
      'Type or insert math expressions using standard operators and brackets.',
      'Supports sqrt(), sin(), cos(), tan(), log(), ln(), abs(), pi, and e.',
      'Review and copy previous results from calculation history.'
    ],
    relatedTools: ['scientific-notation-converter', 'percentage-calculator', 'average-calculator'],
    component: MathExpressionEvaluator
  },

  // ==========================================
  // CATEGORY K: PRIVACY & SECURITY (12)
  // ==========================================
  {
    id: 'password-strength-checker',
    name: 'Password Strength & Entropy Checker',
    shortDescription: 'Audit password complexity, estimate brute-force crack time, and measure information entropy.',
    category: 'security',
    iconName: 'ShieldCheck',
    keywords: ['password strength', 'entropy checker', 'password auditor', 'crack time', 'password safety'],
    offlineAvailable: true,
    instructions: [
      'Type or paste any password to evaluate in private sandbox.',
      'Check calculated entropy bits and GPU brute-force crack duration.',
      'Audit 6 core criteria including length, symbols, and character sets.'
    ],
    relatedTools: ['passphrase-generator', 'random-password-generator', 'secure-pin-generator'],
    component: PasswordStrengthChecker
  },
  {
    id: 'passphrase-generator',
    name: 'Passphrase Generator',
    shortDescription: 'Generate memorable, ultra-strong multi-word passphrases using Diceware randomness and Web Crypto.',
    category: 'security',
    iconName: 'KeyRound',
    keywords: ['passphrase generator', 'diceware', 'memorable password', 'multi word password', 'secure passphrase'],
    offlineAvailable: true,
    instructions: [
      'Choose desired word count (3 to 8 words) and separator character.',
      'Toggle capitalization and random number appending.',
      'Click Generate New Passphrase and copy to clipboard.'
    ],
    relatedTools: ['password-strength-checker', 'random-password-generator', 'secure-pin-generator'],
    component: PassphraseGenerator
  },
  {
    id: 'secure-pin-generator',
    name: 'Secure PIN Generator',
    shortDescription: 'Generate high-entropy 4-digit, 6-digit, and custom numerical PINs with weak-pattern filtering.',
    category: 'security',
    iconName: 'Key',
    keywords: ['secure pin generator', 'atm pin', 'upi pin', 'random pin code', 'numeric passcode'],
    offlineAvailable: true,
    instructions: [
      'Select 4-digit (ATM/Debit), 6-digit (UPI/2FA), or custom length.',
      'Enable "Reject sequential/repetitive PINs" to filter out weak patterns like 1234 or 0000.',
      'Copy individual PINs or generate batch lists.'
    ],
    relatedTools: ['passphrase-generator', 'random-number-generator', 'secure-random-generator'],
    component: SecurePinGenerator
  },
  {
    id: 'text-encryption-tool',
    name: 'Text Encryption Tool (AES-256-GCM)',
    shortDescription: 'Encrypt confidential notes and messages client-side using military-grade AES-256-GCM and PBKDF2.',
    category: 'security',
    iconName: 'Lock',
    keywords: ['text encryption', 'aes 256 encryption', 'pbkdf2', 'encrypt text', 'client side encryption'],
    offlineAvailable: true,
    instructions: [
      'Enter confidential text and a secret passphrase.',
      'Click Encrypt Text to derive a 256-bit AES key with 100,000 PBKDF2 iterations.',
      'Copy the resulting self-contained Base64 ciphertext payload.'
    ],
    relatedTools: ['text-decryption-tool', 'personal-data-masker', 'hash-generator'],
    component: TextEncryptionTool
  },
  {
    id: 'text-decryption-tool',
    name: 'Text Decryption Tool (AES-256-GCM)',
    shortDescription: 'Decrypt AES-256-GCM ciphertext payloads client-side using your secret passphrase.',
    category: 'security',
    iconName: 'Unlock',
    keywords: ['text decryption', 'aes 256 decryption', 'decrypt text', 'aes gcm payload', 'unlock text'],
    offlineAvailable: true,
    instructions: [
      'Paste the Base64 ciphertext generated by the Text Encryption tool.',
      'Input the matching secret password.',
      'Click Decrypt Text to reveal the original plaintext.'
    ],
    relatedTools: ['text-encryption-tool', 'base64-decoder'],
    component: TextDecryptionTool
  },
  {
    id: 'file-hash-checker',
    name: 'Client-Side File Hash Checker',
    shortDescription: 'Calculate cryptographic checksums (SHA-256, SHA-512, SHA-1) of files entirely in your browser.',
    category: 'security',
    iconName: 'FileCheck',
    keywords: ['file hash checker', 'sha256 file', 'file checksum', 'sha512', 'browser file hash'],
    offlineAvailable: true,
    instructions: [
      'Drag and drop any local file into the hashing box.',
      'Browser computes SHA-256, SHA-512, and SHA-1 hashes locally.',
      'Copy the calculated hex digest for verification.'
    ],
    relatedTools: ['file-checksum-verifier', 'hash-generator', 'file-size-analyzer'],
    component: FileHashChecker
  },
  {
    id: 'file-checksum-verifier',
    name: 'File Checksum Verifier',
    shortDescription: 'Verify downloaded files against official developer checksums to detect corruption or tampering.',
    category: 'security',
    iconName: 'ShieldAlert',
    keywords: ['checksum verifier', 'verify download', 'hash comparison', 'file integrity check', 'sha256 match'],
    offlineAvailable: true,
    instructions: [
      'Paste expected checksum published by the software vendor.',
      'Upload the downloaded file to calculate its local hash.',
      'Review instant Match or Mismatch integrity assessment.'
    ],
    relatedTools: ['file-hash-checker', 'hash-generator'],
    component: FileChecksumVerifier
  },
  {
    id: 'secure-random-generator',
    name: 'Secure Random Generator',
    shortDescription: 'Generate high-entropy cryptographic salts, API secrets, session tokens, and keys using Web Crypto.',
    category: 'security',
    iconName: 'Sparkles',
    keywords: ['secure random generator', 'csprng token', 'hex secret', 'crypto random bytes', 'api key generator'],
    offlineAvailable: true,
    instructions: [
      'Select token format: Hexadecimal, Base64, Alphanumeric, or UUIDv4.',
      'Adjust entropy byte length (up to 128 bytes / 1024 bits).',
      'Generate batch tokens and copy with one click.'
    ],
    relatedTools: ['uuid-generator', 'passphrase-generator', 'random-password-generator'],
    component: SecureRandomGenerator
  },
  {
    id: 'personal-data-masker',
    name: 'Personal Data Masker (PII)',
    shortDescription: 'Sanitize and mask sensitive Personally Identifiable Information (emails, phones, cards, IPs) from text.',
    category: 'security',
    iconName: 'EyeOff',
    keywords: ['personal data masker', 'pii redactor', 'mask email', 'mask credit card', 'mask phone number'],
    offlineAvailable: true,
    instructions: [
      'Paste text containing sensitive customer or employee data.',
      'Toggle automatic masking rules for emails, phone numbers, cards, SSN, and IPs.',
      'Copy the sanitized output ready for sharing or public logs.'
    ],
    relatedTools: ['sensitive-text-redactor', 'text-encryption-tool'],
    component: PersonalDataMasker
  },
  {
    id: 'sensitive-text-redactor',
    name: 'Sensitive Text Redactor',
    shortDescription: 'Black out sensitive terms, trade secrets, names, and classified keywords using customizable redaction bars.',
    category: 'security',
    iconName: 'Scissors',
    keywords: ['sensitive text redactor', 'black out text', 'redaction bars', 'document sanitizer', 'redact names'],
    offlineAvailable: true,
    instructions: [
      'Enter document text and specify terms/names to redact.',
      'Select redaction style: Black Bars (████), [REDACTED], or Asterisks (****).',
      'Copy the clean redacted document.'
    ],
    relatedTools: ['personal-data-masker', 'remove-extra-spaces'],
    component: SensitiveTextRedactor
  },
  {
    id: 'url-safety-analyzer',
    name: 'URL Safety & Phishing Analyzer',
    shortDescription: 'Audit suspicious links, expose homograph IDN phishing tricks, inspect parameters, and strip tracking.',
    category: 'security',
    iconName: 'ShieldAlert',
    keywords: ['url safety analyzer', 'phishing link checker', 'punycode detector', 'homograph attack', 'clean url tracking'],
    offlineAvailable: true,
    instructions: [
      'Paste any URL to analyze.',
      'Inspect findings for unencrypted HTTP, IDN Punycode spoofing, IP hostnames, and open redirects.',
      'Click "Copy Clean URL" to strip UTM and analytics trackers.'
    ],
    relatedTools: ['url-encoder', 'url-decoder', 'qr-code-content-inspector'],
    component: UrlSafetyAnalyzer
  },
  {
    id: 'qr-code-content-inspector',
    name: 'QR Code Content & Security Inspector',
    shortDescription: 'Safely inspect raw decoded QR code contents, payments, Wi-Fi credentials, and links without auto-execution.',
    category: 'security',
    iconName: 'QrCode',
    keywords: ['qr code inspector', 'safe qr reader', 'inspect qr payload', 'qr phishing scanner', 'wifi qr reader'],
    offlineAvailable: true,
    instructions: [
      'Upload a QR code image or paste decoded raw string.',
      'Inspect payload type: Web URL, UPI payment, Wi-Fi config, or dial command.',
      'Review safety warnings and security advisory before opening.'
    ],
    relatedTools: ['qr-code-scanner', 'url-safety-analyzer'],
    component: QrCodeContentInspector
  },

  // ==========================================
  // CATEGORY L: FILE & DOCUMENT UTILITIES (17)
  // ==========================================
  {
    id: 'csv-viewer',
    name: 'Interactive CSV Viewer & Table Explorer',
    shortDescription: 'Explore, filter, sort, and paginate through CSV datasets directly inside your browser.',
    category: 'files',
    iconName: 'FileSpreadsheet',
    keywords: ['csv viewer', 'csv reader', 'open csv online', 'explore csv', 'filter csv'],
    offlineAvailable: true,
    instructions: [
      'Upload a CSV file or paste tabular data directly.',
      'Click on any column header to sort ascending or descending.',
      'Use the live search filter and export cleaned data to CSV or JSON.'
    ],
    relatedTools: ['csv-to-json-converter', 'json-to-csv-converter', 'tsv-to-csv-converter'],
    component: CsvViewer
  },
  {
    id: 'csv-to-json-converter',
    name: 'CSV to JSON Converter',
    shortDescription: 'Convert comma-separated values into formatted JSON arrays or keyed objects with type inference.',
    category: 'files',
    iconName: 'FileSpreadsheet',
    keywords: ['csv to json', 'convert csv to json', 'csv json parser', 'csv to object array'],
    offlineAvailable: true,
    instructions: [
      'Upload a CSV file or paste tabular rows.',
      'Choose output format: Array of Objects, 2D Array, or Keyed Map.',
      'Optionally enable automatic number and boolean casting.'
    ],
    relatedTools: ['json-to-csv-converter', 'csv-viewer', 'json-formatter'],
    component: CsvToJsonConverter
  },
  {
    id: 'json-to-csv-converter',
    name: 'JSON to CSV Converter',
    shortDescription: 'Transform JSON arrays and nested structures into clean, standardized CSV files.',
    category: 'files',
    iconName: 'FileSpreadsheet',
    keywords: ['json to csv', 'convert json to csv', 'export json to excel', 'json tabular converter'],
    offlineAvailable: true,
    instructions: [
      'Paste a JSON array of objects or upload a .json file.',
      'System automatically extracts column headers and handles comma escaping.',
      'Download the converted CSV file or copy to clipboard.'
    ],
    relatedTools: ['csv-to-json-converter', 'csv-viewer', 'tsv-to-csv-converter'],
    component: JsonToCsvConverter
  },
  {
    id: 'tsv-to-csv-converter',
    name: 'TSV to CSV Converter',
    shortDescription: 'Convert tab-separated values into standard comma-separated format and vice versa.',
    category: 'files',
    iconName: 'FileSpreadsheet',
    keywords: ['tsv to csv', 'csv to tsv', 'tab separated to comma', 'excel paste to csv'],
    offlineAvailable: true,
    instructions: [
      'Paste TSV data (such as direct copy-pastes from Microsoft Excel or Google Sheets).',
      'Toggle direction between TSV to CSV or CSV to TSV.',
      'Download or copy the standardized file.'
    ],
    relatedTools: ['csv-viewer', 'csv-to-json-converter'],
    component: TsvToCsvConverter
  },
  {
    id: 'text-file-viewer',
    name: 'Universal Text & Log File Viewer',
    shortDescription: 'Inspect and search through code, logs, markdown, and plain text files with line numbering.',
    category: 'files',
    iconName: 'FileText',
    keywords: ['text file viewer', 'log viewer', 'view txt online', 'line counter', 'text reader'],
    offlineAvailable: true,
    instructions: [
      'Open any text file (.txt, .log, .md, .env, .json, source files).',
      'Browse contents with sticky line numbers and word wrap toggle.',
      'Search for keywords with real-time highlighted match counts.'
    ],
    relatedTools: ['text-file-merger', 'text-file-splitter', 'file-size-analyzer'],
    component: TextFileViewer
  },
  {
    id: 'text-file-merger',
    name: 'Text File Merger',
    shortDescription: 'Combine multiple text, markdown, log, or CSV files into a single ordered document.',
    category: 'files',
    iconName: 'Files',
    keywords: ['text file merger', 'combine text files', 'merge logs', 'concat files', 'join txt files'],
    offlineAvailable: true,
    instructions: [
      'Upload multiple text files simultaneously.',
      'Re-order files in the queue using up/down controls.',
      'Set custom divider/separator and download the consolidated file.'
    ],
    relatedTools: ['text-file-splitter', 'text-file-viewer', 'pdf-merger'],
    component: TextFileMerger
  },
  {
    id: 'text-file-splitter',
    name: 'Text File Splitter',
    shortDescription: 'Split oversized text and log files into smaller manageable parts by line count or delimiter.',
    category: 'files',
    iconName: 'Split',
    keywords: ['text file splitter', 'split txt file', 'split log by lines', 'chunk text file'],
    offlineAvailable: true,
    instructions: [
      'Upload large text file or paste raw content.',
      'Choose split method: by fixed line count (e.g. 1000 lines) or custom delimiter.',
      'Download individual parts or copy chunks to clipboard.'
    ],
    relatedTools: ['text-file-merger', 'text-file-viewer', 'pdf-splitter'],
    component: TextFileSplitter
  },
  {
    id: 'file-size-analyzer',
    name: 'File Size & Network Transfer Analyzer',
    shortDescription: 'Convert storage dimensions across byte units and estimate upload/download transfer times.',
    category: 'files',
    iconName: 'HardDrive',
    keywords: ['file size analyzer', 'bytes to mb converter', 'download time estimator', 'transfer speed calculator'],
    offlineAvailable: true,
    instructions: [
      'Select any file or input size in Megabytes.',
      'Inspect exact bytes, KB, MB, GB, KiB, MiB, and GiB.',
      'Review estimated download durations across 4G, 5G, Wi-Fi, and Gigabit networks.'
    ],
    relatedTools: ['file-type-inspector', 'data-storage-converter', 'speed-calculator'],
    component: FileSizeAnalyzer
  },
  {
    id: 'file-type-inspector',
    name: 'File Type & Magic Byte Inspector',
    shortDescription: 'Inspect true binary signatures (magic bytes) to identify genuine file types and uncover spoofing.',
    category: 'files',
    iconName: 'FileCode',
    keywords: ['file type inspector', 'magic bytes', 'file signature checker', 'detect file type', 'extension spoofing'],
    offlineAvailable: true,
    instructions: [
      'Upload any file to read its binary header in private memory.',
      'View hexadecimal and ASCII representations of the first 16 bytes.',
      'Check if the declared file extension matches the actual magic byte signature.'
    ],
    relatedTools: ['file-hash-checker', 'file-size-analyzer'],
    component: FileTypeInspector
  },
  {
    id: 'file-checksum-generator',
    name: 'Batch File Checksum Generator',
    shortDescription: 'Compute SHA-256 checksums across multiple files simultaneously and export standard manifest files.',
    category: 'files',
    iconName: 'FileCheck',
    keywords: ['file checksum generator', 'sha256sum generator', 'batch file hash', 'checksum manifest'],
    offlineAvailable: true,
    instructions: [
      'Select or drop multiple files simultaneously.',
      'Browser computes SHA-256 digest for each file in parallel.',
      'Download standard SHA256SUMS.txt manifest file.'
    ],
    relatedTools: ['file-hash-checker', 'file-checksum-verifier'],
    component: FileChecksumGenerator
  },
  {
    id: 'pdf-page-counter',
    name: 'PDF Page Counter & Dimension Inspector',
    shortDescription: 'Instantly determine total page counts, page dimensions, and orientations for any PDF file.',
    category: 'files',
    iconName: 'FileText',
    keywords: ['pdf page counter', 'count pdf pages', 'pdf dimensions', 'pdf page orientation', 'pdf inspect'],
    offlineAvailable: true,
    instructions: [
      'Select or drop any PDF file.',
      'Browser parses document structure client-side using pdf-lib.',
      'Inspect total page count, average page weight, and point dimensions.'
    ],
    relatedTools: ['pdf-metadata-viewer', 'pdf-merger', 'pdf-splitter'],
    component: PdfPageCounter
  },
  {
    id: 'pdf-metadata-viewer',
    name: 'PDF Metadata Viewer & Editor',
    shortDescription: 'Expose, sanitize, or edit hidden PDF metadata tags including Author, Title, Creator, and timestamps.',
    category: 'files',
    iconName: 'FileText',
    keywords: ['pdf metadata viewer', 'edit pdf author', 'sanitize pdf metadata', 'pdf title editor', 'strip pdf metadata'],
    offlineAvailable: true,
    instructions: [
      'Upload PDF to inspect hidden title, author, subject, and producer tags.',
      'Edit fields or click "Strip All Metadata" for maximum privacy.',
      'Save and download the updated PDF document.'
    ],
    relatedTools: ['pdf-page-counter', 'pdf-compressor', 'personal-data-masker'],
    component: PdfMetadataViewer
  },
  {
    id: 'pdf-merger',
    name: 'Client-Side PDF Merger',
    shortDescription: 'Combine multiple PDF files into a single unified document with complete client-side confidentiality.',
    category: 'files',
    iconName: 'Files',
    keywords: ['pdf merger', 'combine pdf files', 'merge pdf online free', 'join pdfs client side', 'pdf binder'],
    offlineAvailable: true,
    instructions: [
      'Select multiple PDF files to add to the merge queue.',
      'Reorder documents using the up and down arrow controls.',
      'Click "Merge & Download" to generate a single consolidated PDF.'
    ],
    relatedTools: ['pdf-splitter', 'pdf-page-extractor', 'pdf-rotation-tool'],
    component: PdfMerger
  },
  {
    id: 'pdf-splitter',
    name: 'Client-Side PDF Splitter',
    shortDescription: 'Split large PDFs into targeted page range documents in your browser without uploading files.',
    category: 'files',
    iconName: 'Split',
    keywords: ['pdf splitter', 'split pdf by pages', 'extract pdf range', 'separate pdf pages', 'cut pdf'],
    offlineAvailable: true,
    instructions: [
      'Upload your PDF document.',
      'Specify the start page and end page range to extract.',
      'Download the isolated sub-document instantly.'
    ],
    relatedTools: ['pdf-merger', 'pdf-page-extractor', 'pdf-page-counter'],
    component: PdfSplitter
  },
  {
    id: 'pdf-page-extractor',
    name: 'PDF Page Extractor',
    shortDescription: 'Extract non-contiguous or specific page ranges (e.g. 1, 3, 5-8) into a fresh, stand-alone PDF.',
    category: 'files',
    iconName: 'Layers',
    keywords: ['pdf page extractor', 'extract specific pdf pages', 'cherry pick pdf pages', 'selective pdf extract'],
    offlineAvailable: true,
    instructions: [
      'Upload PDF file.',
      'Enter page query string with commas and hyphens (e.g. 1, 3-5, 8).',
      'Download new PDF containing only the selected pages.'
    ],
    relatedTools: ['pdf-splitter', 'pdf-merger', 'pdf-rotation-tool'],
    component: PdfPageExtractor
  },
  {
    id: 'pdf-rotation-tool',
    name: 'PDF Page Rotation Tool',
    shortDescription: 'Permanently rotate upside-down or sideways PDF pages by 90°, 180°, or 270° with client-side security.',
    category: 'files',
    iconName: 'RotateCw',
    keywords: ['rotate pdf', 'pdf page rotation', 'rotate pdf 90 degrees', 'fix upside down pdf', 'turn pdf pages'],
    offlineAvailable: true,
    instructions: [
      'Upload PDF document needing rotation.',
      'Select rotation angle: 90° Clockwise, 180° Flip, or 270° Counter-Clockwise.',
      'Apply to all pages or specify custom page numbers, then download.'
    ],
    relatedTools: ['pdf-merger', 'pdf-page-extractor', 'image-rotator'],
    component: PdfRotationTool
  },
  {
    id: 'pdf-compressor',
    name: 'Client-Side PDF Compressor & Optimizer',
    shortDescription: 'Reduce PDF file sizes by compressing object streams and removing redundant metadata without external servers.',
    category: 'files',
    iconName: 'Minimize2',
    keywords: ['pdf compressor', 'compress pdf client side', 'shrink pdf file size', 'pdf optimizer', 'reduce pdf kb'],
    offlineAvailable: true,
    instructions: [
      'Upload PDF document to optimize.',
      'pdf-lib compacts cross-reference dictionaries and object streams.',
      'Review space saved percentage and download the optimized PDF.'
    ],
    relatedTools: ['pdf-metadata-viewer', 'file-size-analyzer', 'pdf-merger'],
    component: PdfCompressor
  },

  // ==========================================
  // CATEGORY M: EVERYDAY LIFE TOOLS (15)
  // ==========================================
  {
    id: 'grocery-list-maker',
    name: 'Grocery List Maker',
    shortDescription: 'Smart grocery list with department categorization, quantity tracking, and item check-off.',
    category: 'everyday',
    iconName: 'ShoppingCart',
    keywords: ['grocery list', 'supermarket shopping', 'food shopping list', 'grocery checklist', 'market list'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Type items or tap quick suggestions (Milk, Eggs, Bread, Bananas, etc.).',
      'Select departments like Produce, Dairy, Bakery, Pantry, or Beverages.',
      'Check off items as you walk through aisle aisles and export list when finished.'
    ],
    faqs: [
      { question: 'Does it work offline in basement supermarkets?', answer: 'Yes, 100% offline. All items persist in your local browser storage.' }
    ],
    relatedTools: ['shopping-list-manager', 'recipe-measurement-calculator', 'todo-list'],
    component: GroceryListMaker
  },
  {
    id: 'shopping-list-manager',
    name: 'Shopping List Manager & Cost Estimator',
    shortDescription: 'Plan shopping trips, track unit prices, estimated item costs, and cart budgets.',
    category: 'everyday',
    iconName: 'ShoppingBag',
    keywords: ['shopping list', 'shopping cart total', 'buy list', 'retail budget', 'store checklist'],
    offlineAvailable: true,
    instructions: [
      'Set an overall trip shopping budget (e.g. ₹2,000 or $100).',
      'Add items with expected prices and quantities to calculate estimated totals.',
      'Mark items bought to track real-time cart spending against your budget.'
    ],
    relatedTools: ['grocery-list-maker', 'shopping-budget-calculator', 'price-comparison-calculator'],
    component: ShoppingListManager
  },
  {
    id: 'packing-list-generator',
    name: 'Smart Packing List Generator',
    shortDescription: 'Generate customized travel luggage packing lists for vacations, business trips, and camping.',
    category: 'everyday',
    iconName: 'Luggage',
    keywords: ['packing list', 'luggage packing', 'travel packing list', 'suitcase checklist', 'holiday packing'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Choose your destination type, duration, and expected weather conditions.',
      'Generate a tailored checklist of clothing, electronics, toiletries, and essentials.',
      'Check items off as you pack your suitcase.'
    ],
    relatedTools: ['travel-checklist', 'trip-budget-calculator', 'checklist-maker'],
    component: PackingListGenerator
  },
  {
    id: 'recipe-measurement-calculator',
    name: 'Recipe Scale & Kitchen Measurement Calculator',
    shortDescription: 'Scale cooking recipes up or down by servings, and convert cups, grams, ounces, and tablespoons.',
    category: 'everyday',
    iconName: 'Scale',
    keywords: ['recipe scaler', 'kitchen measurements', 'baking converter', 'grams to cups', 'scale servings'],
    offlineAvailable: true,
    instructions: [
      'Enter original serving yield and desired target servings (e.g. scale from 2 to 6).',
      'Input ingredient amounts with units to calculate scaled recipe quantities.',
      'Convert between cups, grams, tablespoons, teaspoons, and milliliters.'
    ],
    relatedTools: ['cooking-timer', 'cooking-measurement-converter', 'weight-converter'],
    component: RecipeMeasurementCalculator
  },
  {
    id: 'cooking-timer',
    name: 'Multi-Dish Cooking & Kitchen Timer',
    shortDescription: 'Simultaneous multi-timer for pasta, baking, grilling, and kitchen tasks with audible chimes.',
    category: 'everyday',
    iconName: 'Timer',
    keywords: ['cooking timer', 'kitchen timer', 'egg timer', 'tea timer', 'baking timer', 'oven clock'],
    offlineAvailable: true,
    instructions: [
      'Pick from presets (Boiling Eggs, Pasta, French Press Coffee, Baking) or set custom minutes.',
      'Run multiple independent dish timers simultaneously.',
      'Hear offline synthesized audio alert chimes when timers reach zero.'
    ],
    relatedTools: ['recipe-measurement-calculator', 'stopwatch-tool', 'countdown-timer'],
    component: CookingTimer
  },
  {
    id: 'water-intake-reminder',
    name: 'Daily Water Intake Reminder & Hydration Tracker',
    shortDescription: 'Calculate daily hydration requirements by body weight and track glasses consumed with sound alerts.',
    category: 'everyday',
    iconName: 'Droplets',
    keywords: ['water intake', 'hydration tracker', 'drink water reminder', 'daily water goal', 'water tracker'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Calculate recommended daily water intake based on body weight and activity level.',
      'Log drinks with 1-click cup buttons (+150ml, +250ml glass, +500ml bottle).',
      'Watch visual water container fill up and review 7-day hydration progress.'
    ],
    relatedTools: ['daily-routine-planner', 'habit-tracker', 'bmi-calculator'],
    component: WaterIntakeReminder
  },
  {
    id: 'daily-routine-planner',
    name: 'Daily Routine Planner (Morning to Night)',
    shortDescription: 'Structured daily routine builder covering morning, afternoon focus, evening, and night habits.',
    category: 'everyday',
    iconName: 'Sun',
    keywords: ['daily routine', 'morning routine', 'evening routine', 'night routine', 'habit schedule', 'daily habits'],
    offlineAvailable: true,
    instructions: [
      'Follow or customize morning, afternoon focus, evening wind-down, and night habits.',
      'Check habits off daily to track consistency percentage and habit time investments.',
      'Data persists in local storage across browser refreshes.'
    ],
    relatedTools: ['habit-tracker', 'daily-planner', 'weekly-planner'],
    component: DailyRoutinePlanner
  },
  {
    id: 'travel-checklist',
    name: 'Comprehensive Travel & Departure Checklist',
    shortDescription: 'Essential pre-trip checklist for passport, foreign currency, medications, and home safety tasks.',
    category: 'everyday',
    iconName: 'Plane',
    keywords: ['travel checklist', 'pre trip checklist', 'before travel', 'flight checklist', 'vacation preparation'],
    offlineAvailable: true,
    instructions: [
      'Choose preset: Vacation, Business Trip, Beach Holiday, or Trekking.',
      'Verify essential passports, tickets, chargers, prescription medications, and home safety lockups.',
      'Export or print checklist before leaving home.'
    ],
    relatedTools: ['packing-list-generator', 'trip-budget-calculator', 'checklist-maker'],
    component: TravelChecklist
  },
  {
    id: 'trip-budget-calculator',
    name: 'Trip & Vacation Budget Calculator',
    shortDescription: 'Plan holiday budgets across flights, hotel, dining, and activities with per-person expense splitting.',
    category: 'everyday',
    iconName: 'Wallet',
    keywords: ['trip budget', 'vacation budget', 'travel cost calculator', 'holiday expense planner', 'travel split'],
    offlineAvailable: true,
    instructions: [
      'Set trip duration, traveler headcount, and allocate category budgets in INR or selected currency.',
      'Log actual travel expenditures to monitor remaining funds and avoid budget overruns.',
      'Export detailed trip expense breakdown to CSV.'
    ],
    relatedTools: ['travel-checklist', 'daily-expense-tracker', 'expense-splitter'],
    component: TripBudgetCalculator
  },
  {
    id: 'fuel-mileage-calculator',
    name: 'Fuel Mileage & Trip Cost Calculator',
    shortDescription: 'Calculate fuel economy in km/L and MPG, compute trip fuel expenses, and log vehicle fill-ups.',
    category: 'everyday',
    iconName: 'Fuel',
    keywords: ['fuel mileage', 'km per liter', 'mpg calculator', 'fuel economy', 'petrol cost calculator', 'trip fuel cost'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Calculate fuel economy: Enter distance traveled and fuel consumed to view km/L, L/100km, and MPG.',
      'Estimate trip costs: Input trip distance, average mileage, and fuel price to calculate total journey cost and carpool splits.',
      'Record refill logs to track long-term fuel efficiency across consecutive full tanks.'
    ],
    relatedTools: ['car-maintenance-tracker', 'fuel-cost-calculator', 'electricity-consumption-estimator'],
    component: FuelMileageCalculator
  },
  {
    id: 'car-maintenance-tracker',
    name: 'Vehicle Maintenance & Service Tracker',
    shortDescription: 'Track oil changes, tire rotations, brake service intervals, insurance renewals, and service history.',
    category: 'everyday',
    iconName: 'Car',
    keywords: ['car maintenance', 'vehicle service log', 'oil change tracker', 'car repair history', 'auto service schedule'],
    offlineAvailable: true,
    instructions: [
      'Set vehicle name, license plate, and current odometer reading.',
      'Monitor maintenance schedules (Engine Oil, Tire Rotation, Brakes, Battery, Insurance, PUC) with status badges.',
      'Log service bills and export maintenance logs to CSV.'
    ],
    relatedTools: ['fuel-mileage-calculator', 'working-hours-tracker'],
    component: CarMaintenanceTracker
  },
  {
    id: 'electricity-consumption-estimator',
    name: 'Household Electricity Consumption Estimator',
    shortDescription: 'Estimate monthly power units (kWh), power bills, and identify energy-hungry home appliances.',
    category: 'everyday',
    iconName: 'Zap',
    keywords: ['electricity consumption', 'power bill calculator', 'kwh calculator', 'appliance power consumption', 'electric units'],
    offlineAvailable: true,
    instructions: [
      'Enter electricity tariff rate (per kWh unit in ₹ or your local currency).',
      'Select or customize appliances (Air Conditioner, Refrigerator, Ceiling Fans, LED Bulbs, TV, Geyser).',
      'Analyze monthly power consumption units, estimated power bills, and appliance share percentages.'
    ],
    relatedTools: ['electricity-bill-calculator', 'internet-data-usage-calculator'],
    component: ElectricityConsumptionEstimator
  },
  {
    id: 'internet-data-usage-calculator',
    name: 'Internet Data Usage & Bandwidth Calculator',
    shortDescription: 'Estimate monthly and daily internet data usage for 4K streaming, video calls, gaming, and downloads.',
    category: 'everyday',
    iconName: 'Wifi',
    keywords: ['internet data usage', 'data consumption calculator', 'bandwidth calculator', 'wifi quota', 'gb calculator'],
    offlineAvailable: true,
    instructions: [
      'Adjust daily hours spent streaming 4K/HD video, on Zoom/Teams video meetings, reels, music, and online gaming.',
      'Input mobile daily limit (e.g. 2 GB/day) or home broadband monthly quota (e.g. 150 GB/month).',
      'Check if usage stays within quota limits and view plan recommendations.'
    ],
    relatedTools: ['electricity-consumption-estimator', 'data-storage-converter'],
    component: InternetDataUsageCalculator
  },
  {
    id: 'age-on-date-calculator',
    name: 'Age on Specific Date Calculator',
    shortDescription: 'Calculate chronological age on any chosen past or future date with milestones and zodiac info.',
    category: 'everyday',
    iconName: 'Cake',
    keywords: ['age on date', 'age on specific date', 'chronological age', 'birthday milestone', 'zodiac age'],
    offlineAvailable: true,
    instructions: [
      'Select your birth date.',
      'Select target comparison date (defaults to today, or pick any past or future date).',
      'View age in years, months, days, total hours, next birthday day-of-week, and lifetime milestones.'
    ],
    relatedTools: ['age-calculator', 'birthday-countdown', 'date-difference-calculator'],
    component: AgeOnDateCalculator
  },
  {
    id: 'random-decision-maker',
    name: 'Random Decision Maker & Spin Wheel',
    shortDescription: 'Animated interactive spin wheel to make quick choices on meals, games, tasks, and workouts.',
    category: 'everyday',
    iconName: 'Dices',
    keywords: ['decision maker', 'wheel of fortune', 'random choice picker', 'spin wheel', 'what to eat picker'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Select a preset (What to Eat, Yes/No, Who Goes First, Weekend Activity) or type custom options.',
      'Click SPIN THE WHEEL to start the animated physics wheel with audio clicks.',
      'Celebrate the winning choice with fanfare and track recent decision history.'
    ],
    relatedTools: ['random-question-picker', 'secure-random-generator'],
    component: RandomDecisionMaker
  },

  // Category N: Templates & Documents (40 Tools)
  ...TEMPLATES_DATA.map((tmpl): ToolItem => ({
    id: tmpl.id,
    name: tmpl.name,
    shortDescription: tmpl.shortDescription,
    category: 'templates' as ToolCategory,
    iconName: tmpl.iconName,
    keywords: [...tmpl.tags, 'template', 'document', 'printable', 'pdf', 'creator', tmpl.category],
    isPopular: [
      'invoice-generator',
      'resume-builder',
      'daily-planner-template',
      'cover-letter-generator',
      'quotation-generator',
      'business-card-maker'
    ].includes(tmpl.id),
    instructions: [
      `Customize ${tmpl.name} text fields, dates, rates, and recipient details in the document editor.`,
      'Adjust font styling, font size scale, and brand accent colors using the Style panel.',
      'Optionally upload an official company or institutional logo.',
      'Click "Print / Save PDF" to produce a clean, vector A4 document with zero margin overflow.'
    ],
    offlineAvailable: true,
    component: createTemplateComponent(tmpl.id)
  })),

  // ==========================================
  // CATEGORY 15: WEB & INTERNET UTILITIES (65)
  // ==========================================
  ...WEB_TOOLS_REGISTRY,

  // ==========================================
  // CATEGORY 16: MEDIA STUDIO (70)
  // ==========================================
  ...MEDIA_TOOLS_REGISTRY,

  // ==========================================
  // CATEGORY 17: COMMUNICATION & SOCIAL (47)
  // ==========================================
  ...COMMUNICATION_TOOLS_REGISTRY,

  // ==========================================
  // CATEGORY 18: HEALTH, FITNESS & WELLNESS (70)
  // ==========================================
  ...HEALTH_TOOLS_REGISTRY,

  // ==========================================
  // CATEGORY 19: TRAVEL, NAVIGATION & PLANNING (55)
  // ==========================================
  ...TRAVEL_TOOLS_REGISTRY,

  // ==========================================
  // CATEGORY 20: HOME, HOUSEHOLD & PROPERTY (70)
  // ==========================================
  ...HOUSEHOLD_TOOLS_REGISTRY
];

// Helper queries
export const getToolById = (id: string): ToolItem | undefined => {
  return TOOLS_REGISTRY.find(t => t.id === id);
};

export const getToolsByCategory = (category: ToolCategory): ToolItem[] => {
  return TOOLS_REGISTRY.filter(t => t.category === category);
};

export const getPopularTools = (): ToolItem[] => {
  return TOOLS_REGISTRY.filter(t => t.isPopular);
};

export const searchTools = (query: string): ToolItem[] => {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];
  return TOOLS_REGISTRY.filter(t => {
    return (
      t.name.toLowerCase().includes(clean) ||
      t.shortDescription.toLowerCase().includes(clean) ||
      t.category.toLowerCase().includes(clean) ||
      t.keywords.some(k => k.toLowerCase().includes(clean))
    );
  });
};
