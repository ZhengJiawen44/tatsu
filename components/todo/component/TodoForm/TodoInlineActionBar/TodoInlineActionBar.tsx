import DateDropdownMenu from "./DateDropdown/DateDropdownMenu";
import NextRepeatDateIndicator from "./NextRepeatDateIndicator";
import PriorityDropdownMenu from "./PriorityDropdown/PriorityDropdownMenu";
import RepeatDropdownMenu from "./RepeatDropdown/RepeatDropdownMenu";
const TodoInlineActionBar = () => {
  return (
    <div className="flex justify-start w-fit  items-center gap-2 px-2 flex-wrap">
      <DateDropdownMenu />
      <PriorityDropdownMenu />
      <RepeatDropdownMenu />
      <NextRepeatDateIndicator />
    </div>
  );
};

export default TodoInlineActionBar;
