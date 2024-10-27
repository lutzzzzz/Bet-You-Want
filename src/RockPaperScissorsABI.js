const RockPaperScissorsABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "gameId",
                "type": "uint256"
            }
        ],
        "name": "GameCanceled",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "gameId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "winner",
                "type": "address"
            }
        ],
        "name": "GameCompleted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "gameId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "creator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "wager",
                "type": "uint256"
            }
        ],
        "name": "GameCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "gameId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "joiner",
                "type": "address"
            }
        ],
        "name": "GameJoined",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "gameId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "player",
                "type": "address"
            }
        ],
        "name": "MoveCommitted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "gameId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "enum RockPaperScissors.Move",
                "name": "move",
                "type": "uint8"
            }
        ],
        "name": "MoveRevealed",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_gameId",
                "type": "uint256"
            }
        ],
        "name": "cancelGame",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_gameId",
                "type": "uint256"
            },
            {
                "internalType": "bytes32",
                "name": "_commitment",
                "type": "bytes32"
            }
        ],
        "name": "commitMove",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint8",
                "name": "_move",
                "type": "uint8"
            },
            {
                "internalType": "string",
                "name": "_nonce",
                "type": "string"
            }
        ],
        "name": "computeCommitment",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address payable",
                "name": "_opponent",
                "type": "address"
            }
        ],
        "name": "createGame",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "gameCounter",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "gameTimeout",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "games",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "wager",
                "type": "uint256"
            },
            {
                "internalType": "address payable",
                "name": "player1",
                "type": "address"
            },
            {
                "internalType": "address payable",
                "name": "player2",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "player1Commit",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "player2Commit",
                "type": "bytes32"
            },
            {
                "internalType": "enum RockPaperScissors.Move",
                "name": "player1Move",
                "type": "uint8"
            },
            {
                "internalType": "enum RockPaperScissors.Move",
                "name": "player2Move",
                "type": "uint8"
            },
            {
                "internalType": "enum RockPaperScissors.GameState",
                "name": "state",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "lastAction",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_gameId",
                "type": "uint256"
            }
        ],
        "name": "joinGame",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_gameId",
                "type": "uint256"
            },
            {
                "internalType": "uint8",
                "name": "_move",
                "type": "uint8"
            },
            {
                "internalType": "string",
                "name": "_nonce",
                "type": "string"
            }
        ],
        "name": "revealMove",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

export default RockPaperScissorsABI;
