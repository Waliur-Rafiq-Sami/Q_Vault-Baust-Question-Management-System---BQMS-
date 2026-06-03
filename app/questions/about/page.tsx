import React from "react"

import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card"

export const metadata = {
  title: "About Us",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="mb-8 text-3xl font-heading">About Us</h1>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex flex-col">
            <img
              src="/sami.png"
              alt="Waliur Rafiq Sami"
              className="w-full h-96 object-contain bg-muted"
            />
            <CardContent>
              <CardTitle>Waliur Rafiq Sami</CardTitle>
              <CardDescription>Team Lead — Expert Frontend Developer</CardDescription>
              <p className="mt-3 text-sm text-muted-foreground">
                Waliur leads the team and brings deep expertise in frontend
                engineering, UX-focused interfaces, and component-driven
                design. He drives the app's visual direction and ensures a
                polished user experience across devices.
              </p>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <img src="/siam.jpg" alt="Md Tamim Hasan Siam" className="w-full h-96 object-contain bg-muted" />
            <CardContent>
              <CardTitle>Md Tamim Hasan Siam</CardTitle>
              <CardDescription>Database Expert</CardDescription>
              <p className="mt-3 text-sm text-muted-foreground">
                Tamim specializes in database design and optimization. He
                architects resilient data models and efficient queries. In his
                free time he enjoys cycling to clear his mind.
              </p>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <img src="/mobasser.png" alt="Mobasser" className="w-full h-96 object-contain bg-muted" />
            <CardContent>
              <CardTitle>Mobasser</CardTitle>
              <CardDescription>Microcontroller & ESP32 Specialist</CardDescription>
              <p className="mt-3 text-sm text-muted-foreground">
                Mobasser brings hardware expertise focused on microcontrollers
                and ESP32 development. He handles embedded integrations and
                firmware prototyping for IoT features.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
