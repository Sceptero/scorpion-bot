const { Client } = require('discord.js')

const client = new Client()

// commands
const moveEveryone = (message) => {
  const targetChannelId = message.member.voiceChannelID
  if (!targetChannelId) return

  const voiceChannels = message.guild.channels.reduce((voiceChannels, channel) => {
    if (channel.type === "voice" && channel.id !== targetChannelId) voiceChannels.push(channel)
    return voiceChannels
  }, [])

  voiceChannels.forEach((channel) => {
    channel.members.forEach((member) => {
      member.setVoiceChannel(targetChannelId).then((member) => {
        console.log(`${member.displayName} moved.`)
      }).catch(console.error)
    })
  })
}

// command handling
const getCommand = (content) => {
  const match = content.match(/^!\w+/)
  if (!match) return null
  
  return match[0].slice(1).toLowerCase()
}

client.on('message', (message) => {
  const command = getCommand(message.cleanContent)
  if (command == null || !message.member.hasPermission('ADMINISTRATOR')) return

  switch (command) {
    case 'getoverhere':
      moveEveryone(message)
      break;
  
    default:
      break;
  }
})

// logs
client.on('error', console.error)
client.on('warn', console.warn)
client.on('disconnect', console.warn)
process.on('uncaughtException', console.error)
process.on('unhandledRejection', console.error)

// login
client.on('ready', () => {
  console.log('Bot running...')
})
client.login(process.env.BOT_TOKEN)
