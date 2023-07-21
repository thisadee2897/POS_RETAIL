import React from "react";

import { ReactSearchAutocomplete } from 'react-search-autocomplete';

function Search({items, handleOnSearch ,handleOnHover, handleOnSelect, placeholder, searchString, formatResult, required, value}){

      return (
        <div className={"Serch"}>
          <header className="App-header">
            <div>
              <ReactSearchAutocomplete
                  placeholder={placeholder}
                  items={items}
                  onHover={(result)=>handleOnHover(result)}
                  onSearch={(string, results)=>handleOnSearch(string)}
                  onSelect={(item)=>handleOnSelect(item)}
                  inputSearchString={searchString}
                  formatResult={(item)=>formatResult(item)}
                  styling={{borderRadius: "10px", fontFamily: "Kanit", zIndex: '1'}}
                  required={required}
                  value={value}  
              />
            </div>
          </header>
        </div>
      );
}

export default Search;