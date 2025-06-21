""" Defines all the terminal commands to be used by the agent
    Using the click module
    Commands list:
    - key: Saves user credentials to the configuration file
    - start: Starts the HTTP server
    - connect: Connects the agent to the MCP server
    - list: Lists the names of all or any specific agent.

"""

import click
import importlib
import os

from eva.utils.config import ADAPTER_MAP, ConfigManager, AgentManager
from eva.http_proxy import server 

MCP_SERVER_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "mcp_proxy"))

@click.command("key")
@click.argument("api_key", type=str)
@click.option("--token", "-t", type=str, help="Bearer token for authentication")
def save_creds(api_key: str, token: str):
    """Saves user credentials to the configuration file.""" 
    config = ConfigManager(api_key=api_key, token=token)  
    try:
        click.echo("User credentials saved successfully.")
        config.save_token()
        config.save_api_key()
        click.echo(f"Credentials saved to {config.config_file}")
    except Exception as e:
        click.echo(f"An error occurred while saving to config file: {str(e)}")

@click.command("connect")
@click.argument("agent_name", type=str)
def connect_agent(agent_name: str):
    """Connects the specified agent to the MCP server."""
    click.echo(f"Connecting agent: {agent_name}")
    agent = AgentManager(agent_name=agent_name)
    if agent.get_agent_status():
        click.echo(f"Agent {agent_name} is already connected.")
        return
    
    try:
        # Get the adapter class based on agent name
        adapter_info = ADAPTER_MAP[agent_name.lower()]
        if not adapter_info:
            click.echo(f"No adapter found for agent: {agent_name}")
            return
            
        # Import the adapter module dynamically
        module = importlib.import_module(f"eva.mcp_proxy.adapters.{agent_name.lower()}")
        adapter_class = getattr(module, adapter_info)
        
        # Create adapter instance and connect
        conn = adapter_class(agent_name=agent_name)
        connected = conn.configure_mcp()
        
        if connected:
            click.echo(f"Agent {agent_name} connected successfully.")
            agent.add_agent(status=True)
        else:
            click.echo(f"Failed to connect agent {agent_name}. Please check the agent name or permissions.")
            
    except Exception as e:
        click.echo(f"Error connecting agent {agent_name}: {str(e)}")

# list command Broken to be fixed soon
@click.command("list")
@click.option("--all", is_flag=True, help="List all connected agents")
@click.option("--status", "agent_name",help="Show status of connected agents")
def list_agents(all: bool, status: str):
    """Lists all connected agents or their statuses."""

    if all:
        click.echo("Listing all connected agents...")
        agent = AgentManager(agent_name="all")
        agents_data = agent.list_all()

        if agents_data.get("agents"):
            for agent_info in agents_data["agents"]:
                name = agent_info.get("name", "Unknown")
                agent_status = agent_info.get("status", "Unknown")
                click.echo(f"Agent: {name} - Status: {agent_status}")
        else:
            click.echo("No agents found.")

    elif status:
        click.echo(f"Showing status of agent '{status}'...")
        agent_manager = AgentManager(agent_name=status.lower())
        agent_status = agent_manager.get_agent_status()
        
        if agent_status:
            click.echo(f"Agent '{status}' is connected (Status: {agent_status}).")
        else:
            click.echo(f"Agent '{status}' is not connected or not found.")
    
    else:
        click.echo("No specific option provided. Use --all or --status <agent_name>.")
        click.echo("Examples:")
        click.echo("  eva list --all")
        click.echo("  eva list --status claude")

@click.command("start")
@click.option("--port", default=8000, help="Port to run the server on (default: 8000)")
def start_server(port: int):
    """Starts the HTTP server for the MCP tools."""
    click.echo(f"Starting HTTP server on port {port}...")
    server.start_server(port=port)

#This is a temporary entrypoint for the CLI tool
if __name__ == "__main__":
    # Create a Click group to combine commands
    @click.group()
    def cli():
        """MCP CLI Tool"""
        pass

    # Add commands to the CLI group
    cli.add_command(connect_agent)
    cli.add_command(list_agents)
    cli.add_command(start_server)
    cli.add_command(save_creds)

    # Run the CLI
    cli()