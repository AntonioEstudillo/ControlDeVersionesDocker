import {supabase} from './supabase.js'

const channel = supabase.channel('test')

channel.on('broadcast', { event: 'supa' }, (payload) => console.log(payload))
  .subscribe()

  