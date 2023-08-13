const { ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');
module.exports = {
    data: {
        name: "status",
        description: "server status",
        trans: "owner_only",
    },
    async execute(client, interaction, args, secret, trans) {
        if (interaction.user.id !== secret.me) {
            const owner_only = trans.strings.find(it => it.name === "owner_only").trans;
            return interaction.reply(owner_only);
        }
        interaction.reply("wait...");
        const os = require('os');
        const util = require('util');
        const exec = util.promisify(require('child_process').exec);
        function storageStatus() {
            let command = os.platform() === "win32" ? 'wmic logicaldisk get size,freespace,caption' : 'df -k /';

            return exec(command).then(stdout => {
                let lines = stdout.stdout.split('\n').filter(Boolean);
                let [_, size, freespace] = os.platform() === "win32" ? lines[1].trim().split(/\s+/) : lines[1].split(/\s+/);
                let usedspace = size - freespace;

                return {
                    total: (size / (1024 ** 3)).toFixed(2),
                    free: (freespace / (1024 ** 3)).toFixed(2),
                    used: (usedspace / (1024 ** 3)).toFixed(2)
                };
            });
        }

        async function getSystemInfo() {
            let hardDiskCmd = os.platform() === "win32" ? 'wmic diskdrive get caption' : 'lsblk -o NAME,TYPE | grep disk';
            let installedPackagesCmd = os.platform() === "win32" ? "wmic product get name" : 'dpkg --get-selections';
            let hardDiskName = await exec(hardDiskCmd);
            let installedPackages = await exec(`${os.platform() === "win32" ? 'powershell "Get-ItemProperty HKLM:\\Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Select-Object DisplayName | Measure-Object | % { $_.Count }"' : 'dpkg --get-selections | wc -l'}`);
            return `Device Name: ${os.hostname()},\nKernel Version: ${os.release()},\nHardDisk Name: ${hardDiskName.stdout.split("\n")[1].split("  \r")[0]},\nNumber of Installed Packages: ${installedPackages.stdout}`;
        }

        async function systemStatus() {
            let str = `System Status\nOS: ${os.type()} ${os.release()}\nCPU: ${os.cpus()[0].model} @ ${os.cpus()[0].speed} MHz (${os.cpus().length} cores)\nRAM: Total: ${(os.totalmem() / (1024 ** 3)).toFixed(2)} GB, Used: ${((os.totalmem() - os.freemem()) / (1024 ** 3)).toFixed(2)} GB (${(((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed(2)}%)\n`;

            try {
                let storage = await storageStatus();
                str += `Storage (${os.platform() === "win32" ? "C:" : "/"}): Total: ${storage.total} GB, Used: ${storage.used} GB, Free: ${storage.free} GB\n`;
                str += await getSystemInfo();
                interaction.editReply(`\`\`\`${str}\`\`\``);
            } catch (error) {
                console.error('Error getting storage usage:', error);
            }
        }



        systemStatus();
    }
}