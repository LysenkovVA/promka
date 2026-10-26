import { createEntityAdapter } from "@reduxjs/toolkit"
import { Protocol } from "../types/protocol.schema"

export const protocolAdapter = createEntityAdapter<Protocol, string>({
  selectId: (entity) => entity.id!,
})
