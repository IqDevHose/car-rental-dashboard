import React, { Dispatch, ReactNode, SetStateAction } from "react";

type Props = {
  haveSearch: boolean;
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
  buttons: ReactNode[];
};

const Options = ({
  haveSearch,
  buttons,
  searchValue,
  setSearchValue,
}: Props) => {
  return (
    <div
      className={`w-full flex flex-wrap gap-4 items-center ${
        haveSearch ? "xl:justify-between" : "justify-end"
      }`}
    >
      {haveSearch && (
        <div className="w-fit md:w-auto">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border focus:border-gray-500 transition ease-in-out border-gray-300 rounded-md outline-none"
            placeholder="Search"
          />
        </div>
      )}
      <div className="flex flex-wrap gap-2 md:gap-4 justify-end">{buttons}</div>
    </div>
  );
};

export default Options;
