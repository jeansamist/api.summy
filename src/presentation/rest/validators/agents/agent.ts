import vine from '@vinejs/vine'

export const createAgentValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1),
    systemPrompt: vine.string().trim().optional(),
    knowlage: vine.string().trim().optional(),
  })
)

export const updateAgentValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).optional(),
    systemPrompt: vine.string().trim().optional(),
    knowlage: vine.string().trim().optional(),
  })
)
