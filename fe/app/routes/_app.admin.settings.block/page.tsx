import BlockDate from "./components/block-date";
import BlockWeekDay from "./components/block-week-day";

const TimesPage = () => {
  return ( 
    <div className="space-y-4">
      <BlockWeekDay />
      <BlockDate />
    </div>
  );
}
 
export default TimesPage;