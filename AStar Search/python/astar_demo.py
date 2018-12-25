# Copyright (c) 2008 Mikael Lind
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.


from astar import astar
import curses, random


DUNGEON = """
    #################
                    #
                    #           ###########
                    #                     #
#############       #                     #
#                   #                     #
#                   #                     #
#          ###################            #
#                            #            #
#                            #            #
#                            #       #    #
#                #############       #    #
#                                    #          #
###############                      #          ###
                                     #          #
                                     #          #
                                     #          #
                           ######################
"""

HEIGHT, WIDTH = 22, 79
MAX_LIMIT = HEIGHT * WIDTH
LIMIT = MAX_LIMIT // 2
DEBUG = False
COLOR = True


class Cell(object):
    def __init__(self, char):
        self.char = char
        self.tag = 0
        self.index = 0
        self.neighbors = None


class Grid(object):

    def __init__(self, cells):
        self.height, self.width = len(cells), len(cells[0])
        self.cells = cells

    def __contains__(self, pos):
        y, x = pos
        return 0 <= y < self.height and 0 <= x < self.width

    def __getitem__(self, pos):
        y, x = pos
        return self.cells[y][x]

    def neighbors(self, y, x):
        for dy, dx in ((-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1),
                       (1, 0), (1, 1)):
            if (y + dy, x + dx) in self:
                yield y + dy, x + dx


def parse_grid(grid_str, width, height):

    # Split the grid string into lines.
    lines = [line.rstrip() for line in grid_str.splitlines()[1:]]

    # Pad the top and bottom.
    top = (height - len(lines)) // 2
    bottom = (height - len(lines) + 1) // 2
    lines = ([''] * top + lines + [''] * bottom)[:height]

    # Pad the left and right sides.
    max_len = max(len(line) for line in lines)
    left = (width - max_len) // 2
    lines = [' ' * left + line.ljust(width - left)[:width - left]
             for line in lines]

    # Create the grid.
    cells = [[Cell(char) for char in line] for line in lines]
    return Grid(cells)


class Engine(object):

    def __init__(self, grid):
        self.grid = grid
        self.y = random.randrange(self.grid.height)
        self.x = random.randrange(self.grid.width)
        self.goal = (random.randrange(self.grid.height),
                     random.randrange(self.grid.width))
        self.limit = LIMIT
        self.tag = 1
        self.nodes = {}
        self.path = []
        self.dirty = True
        self.debug = DEBUG
        self.color = COLOR

    def move_cursor(self, dy, dx):
        y, x = self.y + dy, self.x + dx
        if (y, x) in self.grid:
            self.y, self.x = y, x
            self.dirty = True

    def update_path(self):
        if not self.dirty:
            return
        self.dirty = False
        self.tag += 1
        def neighbors(pos):
            cell = self.grid[pos]
            if cell.neighbors is None:
                y, x = pos
                cell.neighbors = []
                for neighbor_y, neighbor_x in self.grid.neighbors(y, x):
                    if self.grid[neighbor_y, neighbor_x].char != '#':
                        cell.neighbors.append((neighbor_y, neighbor_x))
            return cell.neighbors
        def goal(pos):
            return pos == self.goal
        def cost(from_pos, to_pos):
            from_y, from_x = from_pos
            to_y, to_x = to_pos
            return 14 if to_y - from_y and to_x - from_x else 10
        def estimate(pos):
            y, x = pos
            goal_y, goal_x = self.goal
            dy, dx = abs(goal_y - y), abs(goal_x - x)
            return min(dy, dx) * 14 + abs(dy - dx) * 10
        def debug(nodes):
            self.nodes = nodes
        self.path = astar((self.y, self.x), neighbors, goal, 0, cost,
                          estimate, self.limit, debug)


def update_view(stdscr, engine):

    # Update the grid view.
    success = ((engine.y, engine.x) == engine.goal
               or engine.path and engine.goal == engine.path[-1])
    for y, line in enumerate(engine.grid.cells):
        for x, cell in enumerate(line):
            char = cell.char
            color = curses.COLOR_BLUE if char == '#' else curses.COLOR_BLACK
            if engine.debug:
                node = engine.nodes.get((y, x))
                if node is not None:
                    char = '.'
                    color = curses.COLOR_YELLOW
            stdscr.addch(y, x, char, curses.color_pair(color) if engine.color
                         else 0)

    # Update the status lines.
    blocked = (engine.grid[engine.y, engine.x].char == '#')
    status_1 = ['[+-] Limit = %d' % engine.limit]
    if (engine.y, engine.x) != engine.goal:
        status_1.append('[ENTER] Goal')
    status_1.append('[SPACE] %s' % ('Unblock' if blocked else 'Block'))
    status_1.append('[Q]uit')
    status_2 = 'Searched %d nodes.' % len(engine.nodes)
    stdscr.addstr(HEIGHT, 0, ('  '.join(status_1)).ljust(WIDTH)[:WIDTH],
                  curses.A_STANDOUT)
    stdscr.addstr(HEIGHT + 1, 0, status_2.ljust(WIDTH)[:WIDTH])

    # Update the path and goal.
    path_color = curses.COLOR_GREEN if success else curses.COLOR_RED
    path_attr = curses.color_pair(path_color) if engine.color else 0
    if engine.debug:
        path_attr |= curses.A_STANDOUT
    for i, pos in enumerate(engine.path):
        y, x = pos
        stdscr.addch(y, x, ':', path_attr)
    goal_y, goal_x = engine.goal
    stdscr.addch(goal_y, goal_x, '%', path_attr)

    # Update the start.
    if (engine.y, engine.x) == engine.goal:
        char = '%'
    elif engine.grid[engine.y, engine.x].char == '#':
        char = '#'
    else:
        char = '@'
    stdscr.addch(engine.y, engine.x, char)
    stdscr.move(engine.y, engine.x)


def read_command(stdscr):
    key = stdscr.getch()
    stdscr.nodelay(True)
    while True:
        if stdscr.getch() == -1:
            break
    stdscr.nodelay(False)
    return key


def handle_command(key, engine):

    # Move the cursor.
    if key == ord('7'):                     engine.move_cursor(-1, -1)
    if key in (ord('8'), curses.KEY_UP):    engine.move_cursor(-1,  0)
    if key == ord('9'):                     engine.move_cursor(-1,  1)
    if key in (ord('4'), curses.KEY_LEFT):  engine.move_cursor( 0, -1)
    if key in (ord('6'), curses.KEY_RIGHT): engine.move_cursor( 0,  1)
    if key == ord('1'):                     engine.move_cursor( 1, -1)
    if key in (ord('2'), curses.KEY_DOWN):  engine.move_cursor( 1,  0)
    if key == ord('3'):                     engine.move_cursor( 1,  1)

    # Change the search limit.
    if key == ord('+'):
        if engine.limit < MAX_LIMIT:
            engine.limit += 1
            engine.dirty = True
    if key == ord('-'):
        if engine.limit > 0:
            engine.limit -= 1
            engine.dirty = True

    # Insert or delete a block at the cursor.
    if key == ord(' '):
        cell = engine.grid[engine.y, engine.x]
        cell.char = ' ' if cell.char == '#' else '#'
        for y, x in engine.grid.neighbors(engine.y, engine.x):
            engine.grid[y, x].neighbors = None
        engine.dirty = True

    if key in (ord('\n'), curses.KEY_ENTER):
        if (engine.y, engine.x) != engine.goal:
            engine.goal = engine.y, engine.x
            engine.dirty = True

    if key in (ord('d'), ord('D')):
        engine.debug = not engine.debug
    if key in (ord('c'), ord('C')) and COLOR:
        engine.color = not engine.color


def main(stdscr):
    if COLOR:
        curses.use_default_colors()
        for i in xrange(curses.COLOR_RED, curses.COLOR_WHITE + 1):
            curses.init_pair(i, i, -1)
    grid = parse_grid(DUNGEON, WIDTH, HEIGHT)
    engine = Engine(grid)
    while True:
        engine.update_path()
        update_view(stdscr, engine)
        key = read_command(stdscr)
        if key in (ord('q'), ord('Q')):
            break
        handle_command(key, engine)


if __name__ == '__main__':
	curses.wrapper(main)
