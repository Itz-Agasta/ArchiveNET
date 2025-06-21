""" Defines all the terminal commands to be used by the agent
    Using the click module
    Commands list:
    - start: Starts the HTTP server
    - connect: Connects the agent to the MCP server
    - list: Lists all connected agents or their statuses

"""

import click
from eva.http_proxy import server 
from eva.mcp_proxy.adapters.map import ADAPTER_MAP
import importlib
import os
import json

MCP_SERVER_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "mcp_proxy"))

@click.command("connect")
@click.argument("agent_name", type=str)
def connect_agent(agent_name: str):
    """Connects the specified agent to the MCP server."""
    click.echo(f"Connecting agent: {agent_name}")
    
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
        
        entry = {
            "agent_name": agent_name,
            "connected": connected
        }
        
        if connected:
            click.echo(f"Agent {agent_name} connected successfully.")
            with open("agent_list.json", "a") as f:
                json.dump(entry, f, indent=4)
        else:
            click.echo(f"Failed to connect agent {agent_name}. Please check the agent name or permissions.")
            
    except Exception as e:
        click.echo(f"Error connecting agent {agent_name}: {str(e)}")
    

@click.command("list")
@click.option("--all", is_flag=True, help="List all connected agents")
@click.option("--status", is_flag=True, help="Show status of connected agents")
def list_agents(all: bool, status: bool):
    """Lists all connected agents or their statuses."""
    if all:
        click.echo("Listing all connected agents...")
        # Here you would implement the logic to list all agents
        # Example: list_all_agents()
    elif status:
        click.echo("Showing status of connected agents...")
        # Here you would implement the logic to show status
        # Example: show_agent_status()
    else:
        click.echo("No specific option provided. Use --all or --status.")

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

    # Run the CLI
    cli()