import React from 'react';
import { NavLink } from 'react-router-dom';

import './PagesLinks.css';

export const PagesLinks = () => {
          
    function getLinkClass(obj) {
      let className="PageLink";
      if ( obj.isActive )
        className+=" ActivePageLink";
      return className;
    }

    return (
      <div>
        <NavLink to = {"/:"+1} className={getLinkClass}>1</NavLink>
        <NavLink to = {"/:"+2} className={getLinkClass}>2</NavLink>
        <NavLink to = {"/:"+3} className={getLinkClass}>3</NavLink>
        <NavLink to = {"/:"+4} className={getLinkClass}>4</NavLink>
        <NavLink to = {"/:"+5} className={getLinkClass}>5</NavLink>
      </div>
    );

};