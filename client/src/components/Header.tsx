import React from 'react';
import { NavLink } from 'react-router-dom';

export const Header = (): React.JSX.Element => {
	return (
		<header>
			<nav>
				<ul>
					<li>
						<NavLink to={'/'}>Home</NavLink>
					</li>
				</ul>
			</nav>
		</header>
	);
};
