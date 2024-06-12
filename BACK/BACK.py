from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import time
import copy
import random
import numpy as np
from IPython.display import clear_output
from types import SimpleNamespace
import concurrent.futures

class ConnectX:
    # { INITIALIZATION } -------------------------------------------------------------------------
    def __init__(self, inarow, columns = 0, rows = 0, board = None, turn = 1, last_checker = None):
        self.PLAYER1 = 1
        self.PLAYER2 = 2
        self.NONE = 0
        
        self.inarow = inarow
        if board:
            self.columns = len(board[0])
            self.rows = len(board)
            if board != None:
                self.board = copy.deepcopy(board)
            else:
                self.board = [[self.NONE for i in range(self.columns)] for j in range(self.rows)]
            self.turn = turn
            self.last_checker = copy.deepcopy(last_checker) if last_checker is not None else [-1, -1]
        else: 
            self.columns = columns
            self.rows = rows
            self.board = [[self.NONE for i in range(columns)] for j in range(rows)]
            self.turn = self.PLAYER1
            self.last_checker = [-1, -1]    
    def __str__(self):
        def map_value(value):
            if value == 0:
                return ' '
            elif value == 1:
                return 'X'
            elif value == 2:
                return 'O'
            else:
                return str(value)
        return '\n'.join([' '.join(map(map_value, row)) for row in self.board[::-1]])  
    # { BASIC FUNCTIONs } ------------------------------------------------------------------------
    def print(self, mode ='simplified', mark_last_checker = True, clear = True, sleep = 1, human_mode = False):
        def map_value(value):
            if value == 0:
                return '   '
            elif value == 1:
                return ' X '
            elif value == 2:
                return ' O '
            else:
                return str(value)
        if clear:
            clear_output(wait=True)
        
        display_board = [row[:] for row in self.board]

        if mark_last_checker and hasattr(self, 'last_checker') and self.last_checker:
            x, y = self.last_checker
            if display_board[x][y] == 1:
                display_board[x][y] = '[X]'
            elif display_board[x][y] == 2:
                display_board[x][y] = '[O]'
        
        if mode == 'numerical':
            board = '\n'.join([' '.join(map(str, row)) for row in display_board[::-1]])
        elif mode == 'simplified':
            board = '\n'.join([' '.join(map(map_value, row)) for row in display_board[::-1]])
        else:
            board = '\n'.join([' '.join(map(map_value, row)) for row in display_board[::-1]])
            
        if human_mode:
            column_label = ''
            for c in range(self.columns):
                column_label = column_label + '[' + str(c) + '] '
            board = column_label + '\n' + board + '\n' + column_label
        print(board)
        time.sleep(sleep)
    def clear(self):
        self.board = [[self.NONE for i in range(self.columns)] for j in range(self.rows)]
        self.last_checker = [-1, -1]
        self.turn = self.PLAYER1
    def random(self):
        total_drop_checkers = random.randint(0, self.columns * self.rows)
        for i in range(total_drop_checkers):
            self.drop_checker(random.randint(0, self.columns - 1), self.turn)
    # { AGENT MOVEMENTs } ------------------------------------------------------------------------
    def drop_checker(self, column, player = None):
        if player is None:
            player = self.turn
        for i in range(self.rows):
            if self.board[i][column] == 0:
                self.board[i][column] = player
                self.last_checker = [i, column]
                self.turn = self.PLAYER1 if self.turn == self.PLAYER2 else self.PLAYER2
                return i
        
        return -1
    def retrieve_last_checker(self):
        if self.last_checker[0] != -1 and self.last_checker[1] != -1:
            self.board[self.last_checker[0]][self.last_checker[1]] = 0
            self.last_checker = [-1, -1]
            self.turn = self.PLAYER1 if self.turn == self.PLAYER2 else self.PLAYER2
    # { BOARD STATEs } ---------------------------------------------------------------------------
    def pervious_state(self):
        pervious_state = ConnectX(inarow = self.inarow, board = self.board, turn = self.turn, last_checker = self.last_checker)
        pervious_state.retrieve_last_checker()
        return pervious_state     
    def current_state(self, score_calculation_type = 'NONE', verbose = False): 
        current_instance = ConnectX(inarow = self.inarow, board = self.board, turn = self.turn)  
        return self.calculate_instance_scores(current_instance, score_calculation_type, verbose)
    def next_states(self, score_calculation_type = 'NONE', verbose = False):
        next_states = []
        for drop_column in range(self.columns):
            next_instance = ConnectX(inarow = self.inarow, board = self.board, turn = self.turn, last_checker = self.last_checker)
            drop_row = next_instance.drop_checker(drop_column)
            #IGNORE INVALID MOVES
            if drop_row == -1:
                continue
            
            next_state = self.calculate_instance_scores(next_instance, score_calculation_type, verbose)
            next_states.append(next_state)
        if verbose:
            return None
        else:
            return next_states
   # { STATE SPACE SCORE CALCULATION } ----------------------------------------------------------
    def score(self, score_calculation_type = 'NONE'): 
        if score_calculation_type == 'last_checker_longest_connection':
            return self.last_checker_longest_connection()
        elif score_calculation_type == 'last_checker_longest_connection_remove_limited':
            return self.last_checker_longest_connection_remove_limited()
        elif score_calculation_type == 'last_checker_longest_connection_zero_to_infinity':
            return self.last_checker_longest_connection_zero_to_infinity()
        elif score_calculation_type == 'last_checker_all_connections':
            return self.last_checker_all_connections()
        elif score_calculation_type == 'last_checker_all_connections_remove_limited':
            return self.last_checker_all_connections_remove_limited()
        elif score_calculation_type == 'last_checker_all_connections_zero_to_infinity':
            return self.last_checker_all_connections_zero_to_infinity()
        elif score_calculation_type == 'alpha':
            return self.alpha()            
        elif score_calculation_type == 'beta':
            return self.beta()
        elif 'monte_carlo_random' in score_calculation_type:
            if len(score_calculation_type.split('_')) == 4:
                return self.monte_carlo_random(iteration = score_calculation_type.split('_')[3])
            else:
                return self.monte_carlo_random()
        return 0 
    def calculate_instance_scores(self, instance, score_calculation_type, verbose):
        last_checker_longest_connection = float('-inf')
        last_checker_longest_connection_remove_limited = float('-inf')
        last_checker_longest_connection_zero_to_infinity = float('-inf')
        
        last_checker_all_connections = float('-inf')
        last_checker_all_connections_remove_limited = float('-inf')
        last_checker_all_connections_zero_to_infinity = float('-inf')
        
        alpha = float('-inf')
        beta = float('-inf')
        
        monte_carlo_random = float('-inf')
        
        if score_calculation_type == 'last_checker_longest_connection':
            last_checker_longest_connection = instance.last_checker_longest_connection()
        elif score_calculation_type == 'last_checker_longest_connection_remove_limited':
            last_checker_longest_connection_remove_limited = instance.last_checker_longest_connection_remove_limited()
        elif score_calculation_type == 'last_checker_longest_connection_zero_to_infinity':
            last_checker_longest_connection_zero_to_infinity = instance.last_checker_longest_connection_zero_to_infinity()
        
        elif score_calculation_type == 'last_checker_all_connections':
            last_checker_all_connections = instance.last_checker_all_connections()
        elif score_calculation_type == 'last_checker_all_connections_remove_limited':
            last_checker_all_connections_remove_limited = instance.last_checker_all_connections_remove_limited()
        elif score_calculation_type == 'last_checker_all_connections_zero_to_infinity':
            last_checker_all_connections_zero_to_infinity = instance.last_checker_all_connections_zero_to_infinity()
            
        elif score_calculation_type == 'alpha':
            alpha = instance.alpha()
        elif score_calculation_type == 'beta':
            beta = instance.beta()
            
        elif 'monte_carlo_random' in score_calculation_type:
            if len(score_calculation_type.split('_')) == 4:
                return instance.monte_carlo_random(iteration = score_calculation_type.split('_')[3])
            else:
                return instance.monte_carlo_random()
            
        elif score_calculation_type == 'ALL':
            last_checker_longest_connection = instance.last_checker_longest_connection()
            last_checker_longest_connection_remove_limited = instance.last_checker_longest_connection_remove_limited()
            last_checker_longest_connection_zero_to_infinity = instance.last_checker_longest_connection_zero_to_infinity()
            last_checker_all_connections = instance.last_checker_all_connections()
            last_checker_all_connections_remove_limited = instance.last_checker_all_connections_remove_limited()
            last_checker_all_connections_zero_to_infinity = instance.last_checker_all_connections_zero_to_infinity()
            alpha = instance.alpha()
            beta = instance.beta()
            monte_carlo_random = instance.monte_carlo_random()
                
        calculated_instance = SimpleNamespace(
            state_instance = instance,
            
            last_checker_longest_connection = last_checker_longest_connection,
            last_checker_longest_connection_remove_limited = last_checker_longest_connection_remove_limited,
            last_checker_longest_connection_zero_to_infinity = last_checker_longest_connection_zero_to_infinity,
            
            last_checker_all_connections = last_checker_all_connections,
            last_checker_all_connections_remove_limited = last_checker_all_connections_remove_limited,
            last_checker_all_connections_zero_to_infinity = last_checker_all_connections_zero_to_infinity,
            
            alpha = alpha,
            beta = beta,
            
            monte_carlo_random = monte_carlo_random
        )
        if verbose:
            instance.print(clear=False)
            if score_calculation_type == 'last_checker_longest_connection':
                print("LAST CHECKER LONGEST CONNECTION:", last_checker_longest_connection)
            elif score_calculation_type == 'last_checker_longest_connection_remove_limited':
                print("LAST CHECKER LONGEST CONNECTION REMOVE LIMITED:", last_checker_longest_connection_remove_limited)
            elif score_calculation_type == 'last_checker_longest_connection_zero_to_infinity':
                print("LAST CHECKER LONGEST CONNECTION ZERO TO INFINITY:", last_checker_longest_connection_zero_to_infinity)
            elif score_calculation_type == 'last_checker_all_connections':
                print("LAST CHECKER ALL CONNECTIONS:", last_checker_all_connections)
            elif score_calculation_type == 'last_checker_all_connections_remove_limited':
                print("LAST CHECKER ALL CONNECTIONS REMOVE LIMITED:", last_checker_all_connections_remove_limited)
            elif score_calculation_type == 'last_checker_all_connections_zero_to_infinity':
                print("LAST CHECKER ALL CONNECTIONS ZERO TO INFINITY:", last_checker_all_connections_zero_to_infinity)
            elif score_calculation_type == 'alpha':
                print("ALPHA:", alpha)
            elif score_calculation_type == 'beta':
                print("BETA:", beta)
            elif score_calculation_type == 'monte_carlo_random':
                print("MONTE CARLO RANDOM:", monte_carlo_random)
            elif score_calculation_type == 'ALL':
                print("LAST CHECKER LONGEST CONNECTION:", last_checker_longest_connection)
                print("LAST CHECKER LONGEST CONNECTION REMOVE LIMITED:", last_checker_longest_connection_remove_limited)
                print("LAST CHECKER LONGEST CONNECTION ZERO TO INFINITY:", last_checker_longest_connection_zero_to_infinity)
                print("LAST CHECKER ALL CONNECTIONS:", last_checker_all_connections)
                print("LAST CHECKER ALL CONNECTIONS REMOVE LIMITED:", last_checker_all_connections_remove_limited)
                print("LAST CHECKER ALL CONNECTIONS ZERO TO INFINITY:", last_checker_all_connections_zero_to_infinity)
                print("ALPHA:", alpha)
                print("BETA:", beta)
                print("MONTE CARLO RANDOM:", monte_carlo_random)
        return calculated_instance
 
    def last_checker_longest_connection(self):
        def check_count_in_a_row_next_position(row, column, connection, direction):
            if row < 0 or row >= self.rows or column < 0 or column >= self.columns:
                return connection
            if self.board[row][column] != 3 - self.turn:
                return connection
            return check_count_in_a_row_next_position(row + direction[0], column + direction[1], connection + 1, direction)
        
        directions = [[0,1], [1,0], [1,1], [1,-1]]
        longest_connection = 0
        
        for direction in directions:
            connection = check_count_in_a_row_next_position(self.last_checker[0] + direction[0], self.last_checker[1] + direction[1], 1, direction)
            connection += check_count_in_a_row_next_position(self.last_checker[0] - direction[0], self.last_checker[1] - direction[1], 0, [-direction[0], -direction[1]])
            if connection >= longest_connection:
                longest_connection = connection
        return longest_connection
    def last_checker_longest_connection_remove_limited(self):
        def check_count_in_a_row_next_position(row, column, connection, space, connected, direction):
            if row < 0 or row >= self.rows or column < 0 or column >= self.columns:
                return {'connection': connection, 'space': space}
            if self.board[row][column] == self.turn:
                return {'connection': connection, 'space': space}
            if self.board[row][column] == 3 - self.turn and connected:
                return check_count_in_a_row_next_position(row + direction[0], column + direction[1], connection + 1, space + 1, True, direction)
            return check_count_in_a_row_next_position(row + direction[0], column + direction[1], connection, space + 1, False, direction)
        
        
        directions = [[0,1], [1,0], [1,1], [1,-1]]
        longest_connection = 0
        
        for direction in directions:
            count_connection_and_space = check_count_in_a_row_next_position(self.last_checker[0] + direction[0], self.last_checker[1] + direction[1], 1, 1, True, direction)
            connection = count_connection_and_space['connection']
            space = count_connection_and_space['space']
            count_connection_and_space = check_count_in_a_row_next_position(self.last_checker[0] - direction[0], self.last_checker[1] - direction[1], 0, 0, True, [-direction[0], -direction[1]])
            connection += count_connection_and_space['connection']
            space += count_connection_and_space['space']
            
            if space < self.inarow:
                connection = 0
            if connection >= longest_connection:
                longest_connection = connection
        return longest_connection
    def last_checker_longest_connection_zero_to_infinity(self):
        def check_count_in_a_row_next_position(row, column, connection, space, connected, direction):
            if row < 0 or row >= self.rows or column < 0 or column >= self.columns:
                return {'connection': connection, 'space': space}
            if self.board[row][column] == self.turn:
                return {'connection': connection, 'space': space}
            if self.board[row][column] == 3 - self.turn and connected:
                return check_count_in_a_row_next_position(row + direction[0], column + direction[1], connection + 1, space + 1, True, direction)
            return check_count_in_a_row_next_position(row + direction[0], column + direction[1], connection, space + 1, False, direction)
        
        directions = [[0,1], [1,0], [1,1], [1,-1]]
        longest_connection = 0
        
        for direction in directions:
            count_connection_and_space = check_count_in_a_row_next_position(self.last_checker[0] + direction[0], self.last_checker[1] + direction[1], 1, 1, True, direction)
            connection = count_connection_and_space['connection']
            space = count_connection_and_space['space']
            count_connection_and_space = check_count_in_a_row_next_position(self.last_checker[0] - direction[0], self.last_checker[1] - direction[1], 0, 0, True, [-direction[0], -direction[1]])
            connection += count_connection_and_space['connection']
            space += count_connection_and_space['space']
            
            if space < self.inarow:
                connection = 0
            if connection >= self.inarow:
                connection = float('inf')
                return connection
            if connection >= longest_connection:
                longest_connection = connection
        return longest_connection
    def last_checker_inarow_connection(self):
        def deep_copy_2d_array(array):
            return [[array[i][j] for j in range(len(array[0]))] for i in range(len(array))]
        def check_count_in_a_row_next_position(inarow, row, column, connection_length, direction, inarow_positions):
            if row < 0 or row >= self.rows or column < 0 or column >= self.columns:
                return connection_length
            if self.board[row][column] != 3 - self.turn:
                return connection_length
            if connection_length >= inarow:
                return connection_length
            inarow_positions.append([row, column])
            return check_count_in_a_row_next_position(inarow, row + direction[0], column + direction[1], connection_length + 1, direction, inarow_positions)
        
        directions = [[0,1], [1,0], [1,1], [1,-1]]
        longest_connection = 0
        longest_inarow_positions = []
        
        for direction in directions:
            connection = 1
            inarow_positions = [[self.last_checker[0], self.last_checker[1]]]
            connection = check_count_in_a_row_next_position(self.inarow, self.last_checker[0] + direction[0], self.last_checker[1] + direction[1], connection, direction, inarow_positions)
            connection = check_count_in_a_row_next_position(self.inarow, self.last_checker[0] - direction[0], self.last_checker[1] - direction[1], connection, [-direction[0], -direction[1]], inarow_positions)

            if connection >= longest_connection:
                longest_connection = connection
                longest_inarow_positions = deep_copy_2d_array(inarow_positions)
                
        return longest_inarow_positions
    
    def last_checker_all_connections(self):
        def check_count_in_a_row_next_position(row, column, connection, direction):
            if row < 0 or row >= self.rows or column < 0 or column >= self.columns:
                return connection
            if self.board[row][column] != 3 - self.turn:
                return connection
            return check_count_in_a_row_next_position(row + direction[0], column + direction[1], connection + 1, direction)
        
        directions = [[0,1], [1,0], [1,1], [1,-1]]
        all_connection = 1
        
        for direction in directions:
            connection = check_count_in_a_row_next_position(self.last_checker[0] + direction[0], self.last_checker[1] + direction[1], 0, direction)
            connection += check_count_in_a_row_next_position(self.last_checker[0] - direction[0], self.last_checker[1] - direction[1], 0, [-direction[0], -direction[1]])
            all_connection += connection
        return all_connection
    def last_checker_all_connections_remove_limited(self):
        def check_count_in_a_row_next_position(row, column, connection, space, connected, direction):
            if row < 0 or row >= self.rows or column < 0 or column >= self.columns:
                return {'connection': connection, 'space': space}
            if self.board[row][column] == self.turn:
                return {'connection': connection, 'space': space}
            if self.board[row][column] == 3 - self.turn and connected:
                return check_count_in_a_row_next_position(row + direction[0], column + direction[1], connection + 1, space + 1, True, direction)
            return check_count_in_a_row_next_position(row + direction[0], column + direction[1], connection, space + 1, False, direction)
        
        
        directions = [[0,1], [1,0], [1,1], [1,-1]]
        all_connection = 1
        
        for direction in directions:
            count_connection_and_space = check_count_in_a_row_next_position(self.last_checker[0] + direction[0], self.last_checker[1] + direction[1], 0, 1, True, direction)
            connection = count_connection_and_space['connection']
            space = count_connection_and_space['space']
            count_connection_and_space = check_count_in_a_row_next_position(self.last_checker[0] - direction[0], self.last_checker[1] - direction[1], 0, 0, True, [-direction[0], -direction[1]])
            connection += count_connection_and_space['connection']
            space += count_connection_and_space['space']
            
            if space < self.inarow:
                connection = 0
            all_connection += connection
        return all_connection
    def last_checker_all_connections_zero_to_infinity(self):
        def check_count_in_a_row_next_position(row, column, connection, space, connected, direction):
            if row < 0 or row >= self.rows or column < 0 or column >= self.columns:
                return {'connection': connection, 'space': space}
            if self.board[row][column] == self.turn:
                return {'connection': connection, 'space': space}
            if self.board[row][column] == 3 - self.turn and connected:
                return check_count_in_a_row_next_position(row + direction[0], column + direction[1], connection + 1, space + 1, True, direction)
            return check_count_in_a_row_next_position(row + direction[0], column + direction[1], connection, space + 1, False, direction)
        
        directions = [[0,1], [1,0], [1,1], [1,-1]]
        all_connection = 1
        
        for direction in directions:
            count_connection_and_space = check_count_in_a_row_next_position(self.last_checker[0] + direction[0], self.last_checker[1] + direction[1], 0, 1, True, direction)
            connection = count_connection_and_space['connection']
            space = count_connection_and_space['space']
            count_connection_and_space = check_count_in_a_row_next_position(self.last_checker[0] - direction[0], self.last_checker[1] - direction[1], 0, 0, True, [-direction[0], -direction[1]])
            connection += count_connection_and_space['connection']
            space += count_connection_and_space['space']
            
            if space < self.inarow:
                connection = 0
            if connection >= self.inarow-1:
                connection = float('inf')
                return connection
            all_connection += connection
        return all_connection
    
    def alpha(self):
        def check_count_in_a_row_next_position(row, column, connection, space, isolated_checker, droppable, connected, direction):
            if row < 0 or row >= self.rows or column < 0 or column >= self.columns:
                return {'connection': connection, 'space': space, 'isolated_checker': isolated_checker, 'droppable': droppable}
            if self.board[row][column] == self.turn:
                return {'connection': connection, 'space': space, 'isolated_checker': isolated_checker, 'droppable': droppable}
            if self.board[row][column] == 3 - self.turn and connected:
                return check_count_in_a_row_next_position(row + direction[0], column + direction[1], connection + 1, space, isolated_checker, droppable, True, direction)
            if self.board[row][column] == 3 - self.turn and not connected:
                isolated_checker += round(1.0 / (space + 1.0), 2)
            if space == 0 and (row - 1 < 0 or self.board[row - 1][column] != 0):
                droppable = True
            return check_count_in_a_row_next_position(row + direction[0], column + direction[1], connection, space + 1, isolated_checker, droppable, False, direction)
        
        directions = [[0,1], [1,0], [1,1], [1,-1]]
        all_connection = 1
        
        for direction in directions:
            count_connection_and_space = check_count_in_a_row_next_position(self.last_checker[0] + direction[0], self.last_checker[1] + direction[1], 0, 0, 0, False, True, direction)
            forward_connection = count_connection_and_space['connection']
            forward_space = count_connection_and_space['space']
            isolated_checker = count_connection_and_space['isolated_checker']
            foward_droppable = count_connection_and_space['droppable']
            
            count_connection_and_space = check_count_in_a_row_next_position(self.last_checker[0] - direction[0], self.last_checker[1] - direction[1], 0, 0, 0, False, True, [-direction[0], -direction[1]])
            backward_connection = count_connection_and_space['connection']
            backward_space = count_connection_and_space['space']
            isolated_checker += count_connection_and_space['isolated_checker']
            backward_droppable = count_connection_and_space['droppable']
            
            connection = 0.0 + forward_connection + backward_connection + isolated_checker
            space = forward_space + backward_space
            
            if connection >= self.inarow - 1:
                all_connection = float('inf')
                return all_connection
            if connection >= self.inarow - 2 and foward_droppable and backward_droppable:
                all_connection = float('inf')
                return all_connection
                        
            if space + connection < self.inarow - 1:
                connection = 0
            
            all_connection += connection
        return all_connection  
    def beta(self):
        monte_carlo_random_385 = self.monte_carlo_random(iteration = 385)
        
        beta = monte_carlo_random_385 / 100.0    
        return beta
    
    def monte_carlo_random(self, iteration = 385):
        agent_pool = ['RANDOM']
        total_games = iteration
        score = 0
        
        current_instance = ConnectX(inarow = self.inarow, board = self.board, turn = self.turn, last_checker= self.last_checker)
        
        agent_pool = ['RANDOM']
        total_games = iteration
        
        if current_instance.last_checker_longest_connection() >= current_instance.inarow:
            score = 100.0
            return score
        next_states = current_instance.next_states()
        for next_state in next_states:
            if next_state.state_instance.last_checker_longest_connection() >= current_instance.inarow:
                score = -100.0
                return score
        
        agent_1 = Agent(random.choice(agent_pool)) # type: ignore
        agent_2 = Agent(random.choice(agent_pool)) # type: ignore
        match_result = current_instance.multiple_games(agent_1, agent_2, total_games = total_games, new_game = False, verbose = False)
        score += match_result[3 - self.turn] / total_games * 100.0 * 1.0
        score -= match_result[self.turn] / total_games * 100.0 * 1.0
                
        return score         
    # { GAME } -----------------------------------------------------------------------------------
    def game(self, agent_1, agent_2, echo_options = 'EACH_MOVE | X', new_game = True): # [ECHO_OPTIONS: 'EACH_MOVE', 'EACH_EPISODE', 'NONE'] 
        def count_checkers():
            checkers = 0
            for r in range(self.rows):
                for c in range(self.columns):
                    if self.board[r][c] != 0:
                        checkers += 1
            return checkers
        human_mode = False
        if agent_1.type == 'HUMAN' or agent_2.type == 'HUMAN':
            human_mode = True

        if new_game:
            self.clear()
            checker_dropped = 0
        else:
            checker_dropped = count_checkers()
        configuration = SimpleNamespace(
            columns = self.columns,
            rows = self.rows,
            inarow = self.inarow
        )
        while True:
            if checker_dropped >= self.rows * self.columns:
                if echo_options == 'EACH_EPISODE':
                    self.print(human_mode = human_mode)
                if echo_options == 'EACH_EPISODE' or echo_options == 'EACH_MOVE':
                    print("[DRAW THE GAME]")
                if echo_options == 'NONE':
                    return 0
                break
            observation = SimpleNamespace(
                board = self.board,
                mark = self.turn
            )
            if self.turn == self.PLAYER1:
                drop_column = agent_1.move(observation, configuration)
            else:
                drop_column = agent_2.move(observation, configuration)
            if drop_column == -1:
                if echo_options == 'EACH_EPISODE':
                    self.print(human_mode = human_mode)
                if echo_options == 'EACH_EPISODE' or echo_options == 'EACH_MOVE':
                    print("[PLAYER", self.turn, "LOST THE GAME]")
                if echo_options == 'NONE':
                    return self.turn
                break   
            drop_row = self.drop_checker(drop_column, self.turn)
            if 'EACH_MOVE' in echo_options:
                if len(echo_options.split(' | ')) > 1:
                    self.print(sleep = int(echo_options.split(' | ')[1]), human_mode = human_mode)
                else:
                    self.print(human_mode = human_mode)
            if drop_row == -1:
                if echo_options == 'EACH_EPISODE':
                    self.print(human_mode = human_mode)
                if echo_options == 'EACH_EPISODE' or echo_options == 'EACH_MOVE':
                    print("[PLAYER", self.turn, "LOST THE GAME]")
                if echo_options == 'NONE':
                    return self.turn
                break
            checker_dropped += 1
            if self.last_checker_longest_connection() >= self.inarow:
                if echo_options == 'EACH_EPISODE':
                    self.print(human_mode = human_mode)
                if echo_options == 'EACH_EPISODE' or echo_options == 'EACH_MOVE':
                    print("[PLAYER", 3 - self.turn, "WON THE GAME]")
                if echo_options == 'NONE':
                    return 3 - self.turn
                break
    def multiple_games(self, agent_1, agent_2, total_games = 100, new_game = True, verbose = True):
        results = {1: 0, 2: 0, 0: 0}
        for i in range(total_games):
            clone_instance = ConnectX(self.inarow, board = self.board, turn = self.turn)
            result = clone_instance.game(agent_1, agent_2, echo_options='NONE', new_game = new_game)
            results[result] += 1
        if verbose:
            print("[ PLAYER 1 WINS:", round(results[1]/total_games, 2) * 100, "% PLAYER 2 WINS:", round(results[2]/total_games, 2) * 100, "% DRAWS:", round(results[0]/total_games, 2) * 100, '% ]')
            time.sleep(1)
        return results
"""
Copyright 2020, Sidhant Agarwal, sidhant11136@gmail.com, All rights reserved.
Borrowed from https://github.com/sidhantagar/ConnectX under the MIT license.
"""
class SidhantAgarwal:
    def __init__(self):
        self.max_score = None
    def score_move_a(self, grid, col, mark, config, start_score, n_steps=1):
        global max_score
        next_grid, pos = self.drop_piece(grid, col, mark, config)
        row, col = pos
        score = self.get_heuristic_optimised(grid,next_grid,mark,config, row, col,start_score)
        valid_moves = [col for col in range (config.columns) if next_grid[0][col]==0]
        #Since we have just dropped our piece there is only the possibility of us getting 4 in a row and not the opponent.
        #Thus score can only be +infinity.
        scores = []
        if len(valid_moves)==0 or n_steps ==0 or score == float("inf"):
            return score
        else :
            for col in valid_moves:
                current = self.score_move_b(next_grid,col,mark,config,n_steps-1,score)
                scores.append(current)
                if max_score != None: 
                    if current < max_score:
                        break
            score = min(scores)
            #print (scores)
        return score
    def score_move_b(self, grid, col, mark, config,n_steps, start_score):
        next_grid, pos = self.drop_piece(grid,col,(mark%2)+1,config)
        row, col = pos
        score = self.get_heuristic_optimised(grid,next_grid,mark,config, row, col,start_score)
        valid_moves = [col for col in range (config.columns) if next_grid[0][col]==0]
        
        #The converse is true here.
        #Since we have just dropped opponent piece there is only the possibility of opponent getting 4 in a row and not us.
        #Thus score can only be -infinity.
        if len(valid_moves)==0 or n_steps ==0 or score == float ("-inf"):
            return score
        else :
            scores = [self.score_move_a(next_grid,col,mark,config,n_steps-1) for col in valid_moves]
            score = max(scores)
        return score
    def drop_piece(self, grid, col, mark, config):
        next_grid = grid.copy()
        for row in range(config.rows-1, -1, -1):
            if next_grid[row][col] == 0:
                break
        next_grid[row][col] = mark
        return next_grid,(row,col)
    def get_heuristic(self, grid, mark, config):
        score = 0
        num = self.count_windows(grid,mark,config)
        for i in range(config.inarow):
            #num  = count_windows (grid,i+1,mark,config)
            if (i==(config.inarow-1) and num[i+1] >= 1):
                return float("inf")
            score += (4**(i))*num[i+1]
        num_opp = self.count_windows (grid,mark%2+1,config)
        for i in range(config.inarow):
            if (i==(config.inarow-1) and num_opp[i+1] >= 1):
                return float ("-inf")
            score-= (2**((2*i)+1))*num_opp[i+1]
        return score
    def get_heuristic_optimised(self, grid, next_grid, mark, config, row, col, start_score):
        score = 0
        num1 = self.count_windows_optimised(grid,mark,config,row,col)
        num2 = self.count_windows_optimised(next_grid,mark,config,row,col)
        for i in range(config.inarow):
            if (i==(config.inarow-1) and (num2[i+1]-num1[i+1]) >= 1):
                return float("inf")
            score += (4**(i))*(num2[i+1]-num1[i+1])
        num1_opp = self.count_windows_optimised(grid,mark%2+1,config,row,col)
        num2_opp = self.count_windows_optimised(next_grid,mark%2+1,config,row,col)
        for i in range(config.inarow): 
            if (i==(config.inarow-1) and num2_opp[i+1]-num1_opp[i+1]  >= 1):
                return float ("-inf")     
            score-= (2**((2*i)+1))*(num2_opp[i+1]-num1_opp[i+1])
        score+= start_score
        #print (num1,num2,num1_opp,num2_opp)
        return score
    def check_window(self, window, piece, config):
        if window.count((piece%2)+1)==0:
            return window.count(piece)
        else:
            return -1
    def count_windows(self, grid, piece, config):
        num_windows = np.zeros(config.inarow+1)
        # horizontal
        for row in range(config.rows):
            for col in range(config.columns-(config.inarow-1)):
                window = list(grid[row, col:col+config.inarow])
                type_window = self.check_window(window, piece, config)
                if type_window != -1:
                    num_windows[type_window] += 1
        # vertical
        for row in range(config.rows-(config.inarow-1)):
            for col in range(config.columns):
                window = list(grid[row:row+config.inarow, col])
                type_window = self.check_window(window, piece, config)
                if type_window != -1:
                    num_windows[type_window] += 1
        # positive diagonal
        for row in range(config.rows-(config.inarow-1)):
            for col in range(config.columns-(config.inarow-1)):
                window = list(grid[range(row, row+config.inarow), range(col, col+config.inarow)])
                type_window = self.check_window(window, piece, config)
                if type_window != -1:
                    num_windows[type_window] += 1
        # negative diagonal
        for row in range(config.inarow-1, config.rows):
            for col in range(config.columns-(config.inarow-1)):
                window = list(grid[range(row, row-config.inarow, -1), range(col, col+config.inarow)])
                type_window = self.check_window(window, piece, config)
                if type_window != -1:
                    num_windows[type_window] += 1
        return num_windows
    def count_windows_optimised(self, grid, piece, config, row, col):
        num_windows = np.zeros(config.inarow+1)
        # horizontal
        for acol in range(max(0,col-(config.inarow-1)),min(col+1,(config.columns-(config.inarow-1)))):
            window = list(grid[row, acol:acol+config.inarow])
            type_window = self.check_window(window, piece, config)
            if type_window != -1:
                num_windows[type_window] += 1
        # vertical
        for arow in range(max(0,row-(config.inarow-1)),min(row+1,(config.rows-(config.inarow-1)))):
            window = list(grid[arow:arow+config.inarow, col])
            type_window = self.check_window(window, piece, config)
            if type_window != -1:
                num_windows[type_window] += 1
        # positive diagonal
        for arow, acol in zip(range(row-(config.inarow-1),row+1),range(col-(config.inarow-1),col+1)):
            if (arow>=0 and acol>=0 and arow<=(config.rows-config.inarow) and acol<=(config.columns-config.inarow)):
                window = list(grid[range(arow, arow+config.inarow), range(acol, acol+config.inarow)])
                type_window = self.check_window(window, piece, config)
                if type_window != -1:
                    num_windows[type_window] += 1
        # negative diagonal
        for arow,acol in zip(range(row,row+config.inarow),range(col,col-config.inarow,-1)):
            if (arow >= (config.inarow-1) and acol >=0 and arow <= (config.rows-1) and acol <= (config.columns-config.inarow)):
                window = list(grid[range(arow, arow-config.inarow, -1), range(acol, acol+config.inarow)])
                type_window = self.check_window(window, piece, config)
                if type_window != -1:
                    num_windows[type_window] += 1
        return num_windows
    def agent(self, obs, config):
        global max_score
        max_score = None
        valid_moves = [c for c in range(config.columns) if obs.board[0][c] == 0]
        grid = np.asarray(obs.board).reshape(config.rows, config.columns)
        scores = {}
        start_score = self.get_heuristic(grid, obs.mark, config)
        for col in valid_moves:
            scores[col] = self.score_move_a(grid, col, obs.mark, config,start_score,1)
            if max_score == None or max_score < scores[col]:
                max_score = scores[col]
        # print ("Optimised:",scores)
        max_cols = [key for key in scores.keys() if scores[key] == max(scores.values())]
        return random.choice(max_cols)
"""
Copyright 2020, Sidhant Agarwal, sidhant11136@gmail.com, All rights reserved.
Borrowed from https://github.com/sidhantagar/ConnectX under the MIT license.
"""
class Agent:
    def __init__(self, type): # [TYPE: 'RANDOM', 'GREEDY']
        self.type = type
    def move(self, observation, configuration): 
        if self.type == 'HUMAN':
            return self.move_human(observation, configuration)
        elif self.type == 'RANDOM':
            return self.move_random(observation, configuration)
        elif self.type == 'AGGRESSIVE_MC':
            return self.move_greedy(observation, configuration, score_calculation_type = 'beta')
        elif self.type == 'MINMAX_MC':
            return self.move_minmax_monte_carlo(observation, configuration)
        elif self.type == 'SIDHANT_AGARWAL':
            def board_2d_to_flat(board_2d):
                board_2d_original = board_2d[::-1]
                flat_board = [cell for row in board_2d_original for cell in row]
                return board_2d_original
            original_flat_board = board_2d_to_flat(observation.board)
            converted_observation = SimpleNamespace(
                board = original_flat_board,
                mark = observation.mark
            )
            S = SidhantAgarwal()
            return S.agent(converted_observation, configuration)
        elif 'GREEDY' in self.type:
            greedy_type = self.type.split(' | ')
            if len(greedy_type) == 1:
                return self.move_greedy(observation, configuration)
            else:
                return self.move_greedy(observation, configuration, score_calculation_type = greedy_type[1])
        elif 'MINMAX' in self.type:
            minmax_type = self.type.split(' | ')
            if len(minmax_type) == 1:
                return self.move_minmax(observation, configuration)
            elif len(minmax_type) == 2:
                if minmax_type[1].isnumeric():
                    return self.move_minmax(observation, configuration, depth = int(minmax_type[1]))
                else:
                    return self.move_minmax(observation, configuration, score_calculation_type = minmax_type[1])
            elif len(minmax_type) == 3:
                if minmax_type[1].isnumeric():
                    return self.move_minmax(observation, configuration, depth = int(minmax_type[1]), score_calculation_type = minmax_type[2])
                else:
                    return self.move_minmax(observation, configuration, depth = int(minmax_type[2]), score_calculation_type = minmax_type[1])
            else:
                return self.move_minmax(observation, configuration)
        elif 'MONTE_CARLO' in self.type:
            monte_carlo_type = self.type.split(' | ')
            if len(monte_carlo_type) == 1:
                return self.move_monte_carlo(observation, configuration)
            elif len(monte_carlo_type) == 2:
                return self.move_monte_carlo(observation, configuration, iteration = int(monte_carlo_type[1]))
            else:
                return self.move_monte_carlo(observation, configuration)
        else:
            return self.move_random(observation, configuration)
    # { AGENT MOVEMENTs } ------------------------------------------------------------------------
    # { HUMAN }
    def move_human(self, observation, configuration):
        def str_board(board):
            def map_value(value):
                if value == 0:
                    return ' |'
                elif value == 1:
                    return ' X'
                elif value == 2:
                    return ' O'
                else:
                    return str(value)
            return '\n'.join([' '.join(map(map_value, row)) for row in board[::-1]])  
        
        columns = configuration.columns
        rows = configuration.rows
        inarow = configuration.inarow

        board = observation.board
        mark = observation.mark
        
        current_instance = ConnectX(inarow = inarow, board = board, turn = mark)
        valid_moves = [col for col in range(columns) if board[len(board)-1][col] == 0]
        
        input_label = ''
        for r in range(rows):
            input_label = input_label + '[' + str(r) + ']'
            
        user_input = input(input_label)
        if int(user_input) in valid_moves:
            return int(user_input)
        else:
            return self.move_human(observation, configuration)
    # { RANDOM AGENT }
    def move_random(self, observation, configuration):
        columns = configuration.columns
        rows = configuration.rows
        inarow = configuration.inarow

        board = observation.board
        mark = observation.mark
        
        valid_moves = [col for col in range(columns) if board[len(board)-1][col] == 0]
        if len(valid_moves) == 0:
            return -1
        return random.choice(valid_moves)
    # { GREEDY AGENT }
    def move_greedy(self, observation, configuration, score_calculation_type = 'alpha'):
        columns = configuration.columns
        rows = configuration.rows
        inarow = configuration.inarow

        board = observation.board
        mark = observation.mark
        
        current_state = ConnectX(inarow = inarow, board = board, turn = mark)
        next_states = current_state.next_states(score_calculation_type = 'NONE')
        
        max_score = float('-inf')
        max_score_column = self.move_random(observation, configuration)
        
        for next_state in next_states:
            score = next_state.state_instance.score(score_calculation_type)
            if score > max_score:
                max_score = score
                max_score_column = next_state.state_instance.last_checker[1]
                
        return max_score_column
    # { MINMAX AGENT }
    def move_minmax(self, observation, configuration, depth = 3, score_calculation_type = 'alpha'):
        def minmax_search(current_state, depth, inarow, score_calculation_type):
            if depth == 0:
                return { 'column': float('inf'), 'score': current_state.score(score_calculation_type)}
            
            next_player = current_state.turn
            next_states = current_state.next_states(score_calculation_type = 'NONE')
                        
            if next_player == current_state.PLAYER1:
                max_score = float('-inf')
                max_score_column = self.move_random(observation, configuration)
                for next_state in next_states:
                    score = minmax_search(next_state.state_instance, depth - 1, inarow, score_calculation_type)['score'] 
                    current_state_score = next_state.state_instance.score(score_calculation_type) / depth
                    if current_state_score == float('inf'):
                        score = float('inf')
                    else:
                        score += current_state_score
                    if score > max_score:
                        max_score = score
                        max_score_column = next_state.state_instance.last_checker[1]
                return { 'column': max_score_column, 'score': max_score }
            else:
                min_score = float('inf')
                min_score_column = self.move_random(observation, configuration)
                for next_state in next_states:
                    score = minmax_search(next_state.state_instance, depth - 1, inarow, score_calculation_type)['score'] 
                    current_state_score = next_state.state_instance.score(score_calculation_type) / depth
                    if current_state_score == float('inf'):
                        score = float('-inf')
                    else:
                        score -= current_state_score
                    if score < min_score:
                        min_score = score
                        min_score_column = next_state.state_instance.last_checker[1]
                return { 'column': min_score_column, 'score': min_score }
        
        columns = configuration.columns
        rows = configuration.rows
        inarow = configuration.inarow

        board = observation.board
        mark = observation.mark
        
        current_state = ConnectX(inarow = inarow, board = board, turn = mark)
        return minmax_search(current_state, depth, inarow, score_calculation_type)['column']
    # { MONTE CARLO AGENT }
    def move_monte_carlo(self, observation, configuration, iteration = 385, single_thread = False):
        def monte_carlo_thread_process(state, iterations):
            return state.state_instance.monte_carlo_random(iterations)
        columns = configuration.columns
        rows = configuration.rows
        inarow = configuration.inarow

        board = observation.board
        mark = observation.mark
        
        current_state = ConnectX(inarow = inarow, board = board, turn = mark)
        next_states = current_state.next_states(score_calculation_type = 'NONE')
        
        if single_thread:
            next_state_score_board = [0] * len(next_states)
            
            for index in range(len(next_states)):
                next_state_score_board[index] = next_states[index].state_instance.monte_carlo_random(iteration)
                    
            max_score = float('-inf')
            max_score_column = self.move_random(observation, configuration)
            for index in range(len(next_state_score_board)):
                if next_state_score_board[index] > max_score:
                    max_score = next_state_score_board[index]
                    max_score_column = next_states[index].state_instance.last_checker[1]
        else:
            with concurrent.futures.ThreadPoolExecutor() as executor:
                # Start the load operations and mark each future with its index
                future_to_index = {executor.submit(monte_carlo_thread_process, state, iteration): index for index, state in enumerate(next_states)}
                next_state_score_board = [0] * len(next_states)
                
                for future in concurrent.futures.as_completed(future_to_index):
                    index = future_to_index[future]
                    try:
                        next_state_score_board[index] = future.result()
                    except Exception as exc:
                        print(f"State {index} generated an exception: {exc}")  
            max_score = float('-inf')
            max_score_column = self.move_random(observation, configuration)
            for index, score in enumerate(next_state_score_board):
                if score > max_score:
                    max_score = score
                    max_score_column = next_states[index].state_instance.last_checker[1]
        return max_score_column     
    # { MINMAX MONTE CARLO AGENT }
    def move_minmax_monte_carlo(self, observation, configuration, depth = 3, score_calculation_type = 'beta'):
        def minmax_search(current_state, depth, inarow, score_calculation_type):
            if depth == 0:
                return { 'column': float('-inf'), 'score': current_state.score(score_calculation_type)}
            
            next_player = current_state.turn
            next_states = current_state.next_states(score_calculation_type = 'NONE')
                        
            if next_player == current_state.PLAYER1:
                max_score = -1
                max_score_column = self.move_random(observation, configuration)
                for next_state in next_states:
                    score = minmax_search(next_state.state_instance, depth - 1, inarow, score_calculation_type)['score'] 
                    current_state_score = next_state.state_instance.score(score_calculation_type) / depth
                    if current_state_score == 1:
                        max_score = 1
                        max_score_column = next_state.state_instance.last_checker[1]
                        break
                    else:
                        score += current_state_score
                    if score > max_score:
                        max_score = score
                        max_score_column = next_state.state_instance.last_checker[1]
                return { 'column': max_score_column, 'score': max_score }
            else:
                min_score = 1
                min_score_column = self.move_random(observation, configuration)
                for next_state in next_states:
                    score = minmax_search(next_state.state_instance, depth - 1, inarow, score_calculation_type)['score'] 
                    current_state_score = next_state.state_instance.score(score_calculation_type) / depth
                    if current_state_score == 1:
                        min_score = -1
                        min_score_column = next_state.state_instance.last_checker[1]
                        break
                    else:
                        score -= current_state_score
                    if score < min_score:
                        min_score = score
                        min_score_column = next_state.state_instance.last_checker[1]
                return { 'column': min_score_column, 'score': min_score }
        
        columns = configuration.columns
        rows = configuration.rows
        inarow = configuration.inarow

        board = observation.board
        mark = observation.mark
        
        current_state = ConnectX(inarow = inarow, board = board, turn = mark)
        return minmax_search(current_state, depth, inarow, score_calculation_type)['column']
app = Flask(__name__)
CORS(app)

@app.route('/request_agent_movement', methods=['POST'])
def request_agent_movement():
    data = request.get_json()
    
    board = np.array(data['board'])
    player_type = data['player']
    agent_type = data['agent']
    inarow = data['inarow']

    configuration = SimpleNamespace(
        columns = board.shape[1],
        rows = board.shape[0],
        inarow = inarow
    )
    observation = SimpleNamespace(
        board = board.tolist()[::-1],
        mark = player_type
    )
    
    C = ConnectX(inarow = configuration.inarow, board = observation.board, turn = observation.mark)
    
    agent = Agent(agent_type)
    column = agent.move(observation, configuration)
    
    return jsonify({'column': column})
@app.route('/check_state_status', methods=['POST'])
def check_state_status():
    data = request.get_json()
    board = np.array(data['board'])
    player_type = data['player']
    inarow = data['inarow']
    last_checker = data['lastChecker']
    
    configuration = SimpleNamespace(
        columns = board.shape[1],
        rows = board.shape[0],
        inarow = inarow
    )
    observation = SimpleNamespace(
        board = board.tolist()[::-1],
        mark = player_type
    )

    C = ConnectX(inarow = configuration.inarow, board = observation.board, turn = observation.mark, last_checker = [board.shape[0] - 1 - last_checker['row'], last_checker['column']])
    
    if C.last_checker_longest_connection() >= C.inarow:
        return jsonify({'status': 3 - C.turn})
    
    is_draw = True
    for r in range(C.rows):
        for c in range(C.columns):
            if C.board[r][c] == 0:
                is_draw = False
                break
    if is_draw:
        return jsonify({'status': 0})
    return jsonify({'status': 3})
@app.route('/request_the_winning_connection', methods=['POST'])
def request_the_winning_connection():
    data = request.get_json()
    board = np.array(data['board'])
    player_type = data['player']
    inarow = data['inarow']
    last_checker = data['lastChecker']
    
    configuration = SimpleNamespace(
        columns = board.shape[1],
        rows = board.shape[0],
        inarow = inarow
    )
    observation = SimpleNamespace(
        board = board.tolist()[::-1],
        mark = player_type
    )

    C = ConnectX(inarow = configuration.inarow, board = observation.board, turn = 3 - observation.mark, last_checker = [board.shape[0] - 1 - last_checker['row'], last_checker['column']])
    
    inarow_checker_positions = C.last_checker_inarow_connection()
    for inarow_checker_position in inarow_checker_positions:
        inarow_checker_position[0] = board.shape[0] - 1 - inarow_checker_position[0]
    
    return jsonify({'inarowCheckerPositions': inarow_checker_positions})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)