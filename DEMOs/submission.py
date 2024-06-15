import copy
import random
import numpy as np
from types import SimpleNamespace

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
    # { BASIC FUNCTIONs } ------------------------------------------------------------------------
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
    # { STATE SPACE SCORE CALCULATION } -----------------------------------------------------------
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

    def beta(self): # [0] WIN LOWER BOUND [1] WIN PROBABILITY [2] WIN UPPER BOUND [3] LOST LOWER BOUND [4] LOST PROBABILITY [5] LOST UPPER BOUND
        def beta_monte_carlo_random(state_instance, iteration = 385):
            agent_pool = ['RANDOM']
            total_games = iteration
            win_and_lost_prob = [0.0, 0.0]
            
            current_instance = ConnectX(inarow = state_instance.inarow, board = state_instance.board, turn = state_instance.turn, last_checker= state_instance.last_checker)
            
            # If current move leads us to win the game, then we should make that move by setting score to 100 --------------------------------------------------------
            if current_instance.last_checker_longest_connection() >= current_instance.inarow:
                win_and_lost_prob = [100.0, 0.0]
                return win_and_lost_prob
            next_states = current_instance.next_states()
            
            # If after current move, there's a move that can leads to our opponent winning, then we should avoid that move by setting score to -100 ------------------
            for next_state in next_states:
                if next_state.state_instance.last_checker_longest_connection() >= current_instance.inarow:
                    win_and_lost_prob = [0.0, 100.0]
                    return win_and_lost_prob
            
            agent_1 = Agent(random.choice(agent_pool)) # type: ignore
            agent_2 = Agent(random.choice(agent_pool)) # type: ignore
            match_result = current_instance.multiple_games(agent_1, agent_2, total_games = total_games, new_game = False, verbose = False)
            win_and_lost_prob = [match_result[3 - state_instance.turn] / total_games * 100.0 * 1.0, match_result[state_instance.turn] / total_games * 100.0 * 1.0]
                    
            return win_and_lost_prob   

        win_and_lost_prob = beta_monte_carlo_random(self)
        beta_win = win_and_lost_prob[0] / 100.0
        return beta_win
    def monte_carlo_random(self, iteration = 385):
        agent_pool = ['RANDOM']
        total_games = iteration
        score = 0
        
        current_instance = ConnectX(inarow = self.inarow, board = self.board, turn = self.turn, last_checker= self.last_checker)
        
        # If current move leads us to win the game, then we should make that move by setting score to 100 --------------------------------------------------------
        if current_instance.last_checker_longest_connection() >= current_instance.inarow:
            score = 100.0
            return score
        next_states = current_instance.next_states()
        
        # If after current move, there's a move that can leads to our opponent winning, then we should avoid that move by setting score to -100 ------------------
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
            # DRAW CHECKER --------------------------------------------------------------
            if checker_dropped >= self.rows * self.columns:
                if echo_options == 'NONE':
                    return 0
                break
            # DRAW CHECKER --------------------------------------------------------------
            
            observation = SimpleNamespace(
                board = self.board,
                mark = self.turn
            )
            
            # PLAYER DROP CHECKER ======================================================= 
            if self.turn == self.PLAYER1:
                drop_column = agent_1.move(observation, configuration)
            else:
                drop_column = agent_2.move(observation, configuration)  
            # PLAYER DROP CHECKER ======================================================= 
            
            # LOST DUE TO PLAYER MADE INVALID MOVE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 
            if drop_column == -1:
                if echo_options == 'NONE':
                    return self.turn
                break   
            # LOST DUE TO PLAYER MADE INVALID MOVE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 
            drop_row = self.drop_checker(drop_column, self.turn)
            
            if drop_row == -1:
                if echo_options == 'NONE':
                    return self.turn
                break
            checker_dropped += 1
            # CHECK WINNER ---------------------------------------------------------------
            if self.last_checker_longest_connection() >= self.inarow:
                if echo_options == 'NONE':
                    return 3 - self.turn
                break
            # CHECK WINNER ---------------------------------------------------------------
    def multiple_games(self, agent_1, agent_2, total_games = 100, new_game = True, verbose = True):
        results = {1: 0, 2: 0, 0: 0}
        for i in range(total_games):
            clone_instance = ConnectX(self.inarow, board = self.board, turn = self.turn)
            result = clone_instance.game(agent_1, agent_2, echo_options='NONE', new_game = new_game)
            results[result] += 1
        return results
class Agent:
    def __init__(self, type): # [TYPE: 'RANDOM', 'GREEDY']
        self.type = type
    def move(self, observation, configuration): 
        if self.type == 'RANDOM':
            return self.move_random(observation, configuration)
        elif self.type == 'AGGRESSIVE_MC':
            return self.move_greedy(observation, configuration, score_calculation_type = 'beta')
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

def act(observation, configuration):
    def flat_to_2d(board, rows, columns):
        return [board[i * columns:(i + 1) * columns] for i in range(rows)]
    
    board_2d = np.array(flat_to_2d(observation.board, configuration.rows, configuration.columns)).tolist()[::-1]
    print(board_2d)
    converted_observation = SimpleNamespace(
        board = board_2d,
        mark = observation.mark
    )
    
    A = Agent('AGGRESSIVE_MC')
    return A.move(converted_observation, configuration)