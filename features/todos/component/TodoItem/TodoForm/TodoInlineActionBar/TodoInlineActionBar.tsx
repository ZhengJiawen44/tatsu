import DateDropdownMenu from "./DateDropdown/DateDropdownMenu";
import NextRepeatDateIndicator from "./NextRepeatDateIndicator";
import PriorityDropdownMenu from "./PriorityDropdown/PriorityDropdownMenu";
import RepeatDropdownMenu from "./RepeatDropdown/RepeatDropdownMenu";
const TodoInlineActionBar = () => {
  return (
    <div className="flex justify-center items-center gap-2">
      <DateDropdownMenu />
      <PriorityDropdownMenu />
      <RepeatDropdownMenu />
      <NextRepeatDateIndicator />
    </div>
  );
};

export default TodoInlineActionBar;
