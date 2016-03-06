# canvas-mini-proj

SCRAPPED<br>
~~Slingshot-Type Game:~~
~~- Canvas: Half-Dedicated to Player, Other-Half to Target~~
~~- Player: Shoots by clicking, dragging to another part of screen, and then releasing~~
~~- Mechanics: Shot movement determeined by delta-x, delta-y of points from intial click to release~~
~~- Target: Moves around their half of screen~~

Asteroids Remake:
- Player: inital location at the center of the screen, moves with arrow keys, shoots with mouseclick or space. Upon collision with an asteroid, dies.
- Player Movement Mechanics: Left/Right arrow keys rotates it in its position( xy shouldn't change ), Up/Down propel it forwards/backwards at its angle. 
- Asteroids: move with velocity depending on size (larger:slower->smaller:faster). Upon being shot, fractures into two smaller asteroids of a smaller size. Three size tiers. 

Notes About Player Movement Mechanics:
- All angles are in RADIANS
- The 0 radian mark shall be the positive x axis, going COUNTER-clockwise
