from pathlib import Path
import json

AGENT_CONFIG_FILENAMES = {
    "claude": "claude_desktop_config.json",
    "cursor": "mcp.json",
    "cline": "cline_mcp_settings.json",
    "vscode": "mcp.json",
}

ADAPTER_MAP = {
    "claude": "ClaudeAdapter",
    "cursor": "CursorAdapter",
    "cline": "ClineAdapter",
    "vscode": "VSCodeAdapter",
}

CONFIG_DIR = Path.home() / ".eva"
CONFIG_FILE = CONFIG_DIR / "evasrc"

class ConfigManager:
    def __init__(self, api_key: str = None, token: str = None):
        self.config_dir = CONFIG_DIR
        self.config_file = CONFIG_FILE
        self.api_key = api_key
        self.token = token
        self.ensure_config_dir()

    def ensure_config_dir(self):
        """Ensure the configuration directory exists."""
        if not self.config_dir.exists():
            self.config_dir.mkdir(parents=True, exist_ok=True)

    def get_api_key(self) -> str:
        """Retrieve the API key from the configuration file."""
        if self.api_key:
            return self.api_key
        
        if not self.config_file.exists():
            raise FileNotFoundError(f"Configuration file not found: {self.config_file}")
        
        with open(self.config_file, 'r') as f:
            config = json.load(f)
        
        return config.get("api_key", "")
    
    def get_token(self) -> str:
        """Retrieve the token from the configuration file."""
        if self.token:
            return self.token
        
        if not self.config_file.exists():
            raise FileNotFoundError(f"Configuration file not found: {self.config_file}")
        
        with open(self.config_file, 'r') as f:
            config = json.load(f)
        
        return config.get("token", "")
    
    def save_token(self):
        """Save the token to the configuration file."""
        self.ensure_config_dir()
        
        # Load existing config or create new one
        config = {}
        if self.config_file.exists():
            try:
                with open(self.config_file, 'r') as f:
                    config = json.load(f)
            except (json.JSONDecodeError, FileNotFoundError):
                config = {}
        
        # Update only the token
        config["Authorization"] = f"Bearer {self.token}"
        
        with open(self.config_file, 'w') as f:
            json.dump(config, f, indent=4)
    
    def save_api_key(self):
        """Save the API key to the configuration file."""
        self.ensure_config_dir()
        
        # Load existing config or create new one
        config = {}
        if self.config_file.exists():
            try:
                with open(self.config_file, 'r') as f:
                    config = json.load(f)
            except (json.JSONDecodeError, FileNotFoundError):
                config = {}
        
        # Update only the api_key
        config["x-contract-id"] = self.api_key
        
        with open(self.config_file, 'w') as f:
            json.dump(config, f, indent=4)

class AgentManager:
    def __init__(self, agent_name: str):
        self.agent_name = agent_name.lower()
        self.config_dir = CONFIG_DIR
        self.config_file = CONFIG_DIR / "agents.json"

    def load_agents(self)-> dict:
        """Load agents from the JSON file."""
        try:
            with open(self.config_file, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return {"agents": []}

    def save_agents(self, agents: dict):
        """Save agents to the JSON file."""
        with open(self.config_file, 'w') as f:
            json.dump(agents, f, indent=4)
    
    def ensure_config_file(self):
        """Ensure the agents config file exists."""
        if not self.config_file.exists():
            initial_data = {"agents": []}
            with open(self.config_file, 'w') as f:
                json.dump(initial_data, f, indent=4)

    def add_agent(self, status: str) -> bool:
        """Add a new agent to agent list file."""

        self.ensure_config_file()
        data = self.load_agents()

        for agent in data["agents"]:
            if agent["name"] == self.name:
                return False  # Agent already exists
            
        new_agent = {
            "name": self.name,
            "status": status
        }

        data["agents"].append(new_agent)
        self.save_agents(data)
        return True
    
    def remove_agent(self) -> bool:
        """Remove an agent from the agent list file."""
        self.ensure_config_file()
        data = self.load_agents()

        for agent in data["agents"]:
            if agent["name"] == self.name:
                data["agents"].remove(agent)
                self.save_agents(data)
                return True
        return False
    
    def get_agent_status(self) -> bool:
        """Get the status of an agent."""
        self.ensure_config_file()
        data = self.load_agents()

        for agent in data["agents"]:
            if agent["name"] == self.name:
                return agent.get("status", False)
        return False

    def set_agent_status(self, status: str) -> bool:
        """Set the status of an agent."""
        self.ensure_config_file()
        data = self.load_agents()

        for agent in data["agents"]:
            if agent["name"] == self.name:
                agent["status"] = status
                self.save_agents(data)
                return True
        return False
    
    def list_all(self)-> list:
        """List all agents."""
        self.ensure_config_file()
        return self.load_agents()