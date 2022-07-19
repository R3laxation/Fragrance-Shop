
import Commerce from '@chec/commerce.js'

export const commerce = new Commerce( process.env.REACT_APP_CHECK_PUBLIC_KEY || 'pk_44768154d8e9d80f32799c6eeedffd7da59e834b35d25', true);
