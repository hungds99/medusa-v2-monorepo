declare module "virtual:medusa/widgets/*" {
  import type { ComponentType } from "react"

  const widgets: { Component: ComponentType<any> }[]

  export default {
    widgets,
  }
}

declare module "virtual:medusa/routes/pages" {
  const pages: { path: string; Component: () => JSX.Element }[]

  export default {
    pages,
  }
}

declare module "virtual:medusa/routes/links" {
  import type { ComponentType } from "react"

  const links: { path: string; label: string; icon?: ComponentType }[]

  export default {
    links,
  }
}
