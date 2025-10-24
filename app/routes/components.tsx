import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import { Radio, RadioGroup } from "~/components/ui/radio-group";
import { Progress } from "~/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Alert, AlertTitle, AlertDescription } from "~/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";

export default function ComponentsShowcase() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Gaia Components Showcase</h1>

      {/* Buttons */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="transparent">Transparent Button</Button>
          <Button variant="default" disabled>Disabled Button</Button>
          <Button variant="default" size="icon">🔥</Button>
        </div>
      </section>

      {/* Badges */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Badges</h2>
        <div className="flex flex-wrap gap-3 items-center">
          <Badge variant="default" className="px-3 py-1.5">Default</Badge>
          <Badge variant="information" className="px-3 py-1.5">Information</Badge>
          <Badge variant="success" className="px-3 py-1.5">Success</Badge>
          <Badge variant="warning" className="px-3 py-1.5">Warning</Badge>
          <Badge variant="error" className="px-3 py-1.5">Error</Badge>
          <Badge variant="muted" className="px-3 py-1.5">Muted</Badge>
          <Badge variant="default" size="dot" />
          <Badge variant="information" size="dot" />
          <Badge variant="success" size="dot" />
        </div>
      </section>

      {/* Cards */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="default">
            <div className="p-4">
              <h3 className="font-semibold mb-2">Default Card</h3>
              <p>This is a default card with some content.</p>
            </div>
          </Card>
          <Card variant="selectable">
            <div className="p-4">
              <h3 className="font-semibold mb-2">Selectable Card</h3>
              <p>This card can be selected.</p>
            </div>
          </Card>
          <Card variant="selected">
            <div className="p-4">
              <h3 className="font-semibold mb-2">Selected Card</h3>
              <p>This card is currently selected.</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Alerts */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Alerts / Notifications</h2>
        <div className="space-y-3">
          <Alert variant="information">
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>This is an information notification.</AlertDescription>
          </Alert>
          <Alert variant="success">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Your changes have been saved successfully.</AlertDescription>
          </Alert>
          <Alert variant="warning">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>Please review your input before proceeding.</AlertDescription>
          </Alert>
          <Alert variant="error">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>An error occurred while processing your request.</AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Form Elements */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Form Elements</h2>
        <div className="space-y-6 max-w-md">
          <div>
            <label className="block mb-2 font-medium">Input</label>
            <Input placeholder="Enter text..." />
          </div>
          <div>
            <label className="block mb-2 font-medium">Input with validation</label>
            <Input invalid placeholder="Invalid input" />
          </div>
          <div>
            <label className="block mb-2 font-medium">Input with success</label>
            <Input success placeholder="Valid input" />
          </div>
          <div>
            <label className="block mb-2 font-medium">Textarea</label>
            <Textarea placeholder="Enter longer text..." rows={4} />
          </div>
          <div>
            <label className="block mb-2 font-medium">Checkboxes</label>
            <div className="flex flex-col gap-3">
              <Checkbox label="Option 1" />
              <Checkbox label="Option 2" defaultChecked />
              <Checkbox label="Option 3 (invalid)" invalid />
            </div>
          </div>
          <div>
            <label className="block mb-2 font-medium">Radio Buttons</label>
            <RadioGroup className="gap-3">
              <Radio name="radio-demo" label="Choice 1" value="1" />
              <Radio name="radio-demo" label="Choice 2" value="2" defaultChecked />
              <Radio name="radio-demo" label="Choice 3" value="3" />
            </RadioGroup>
          </div>
          <div>
            <label className="block mb-2 font-medium">Switches</label>
            <div className="flex flex-col gap-3">
              <Switch label="Enable feature" />
              <Switch label="Enabled by default" defaultChecked />
              <Switch label="Disabled switch" disabled />
            </div>
          </div>
        </div>
      </section>

      {/* Progress */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Progress</h2>
        <div className="space-y-4 max-w-md">
          <Progress value={25} label="Loading (25%)" />
          <Progress value={50} label="Processing (50%)" />
          <Progress value={75} label="Almost there (75%)" variant="success" />
          <Progress value={100} label="Complete!" variant="success" />
          <Progress variant="error" value={30} label="Error occurred" />
          <Progress indeterminate label="Loading..." />
        </div>
      </section>

      {/* Avatars */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Avatars</h2>
        <div className="flex gap-4 items-end">
          <Avatar size="small">
            <AvatarFallback>S</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar size="large">
            <AvatarFallback>LG</AvatarFallback>
          </Avatar>
        </div>
      </section>

      {/* Tabs */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Tabs</h2>
        <Tabs defaultValue="tab1">
          <TabsList orientation="horizontal" keyline>
            <TabsTrigger value="tab1">First Tab</TabsTrigger>
            <TabsTrigger value="tab2">Second Tab</TabsTrigger>
            <TabsTrigger value="tab3">Third Tab</TabsTrigger>
            <TabsTrigger value="tab4" disabled>Disabled Tab</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <p className="p-4">Content for the first tab.</p>
          </TabsContent>
          <TabsContent value="tab2">
            <p className="p-4">Content for the second tab.</p>
          </TabsContent>
          <TabsContent value="tab3">
            <p className="p-4">Content for the third tab.</p>
          </TabsContent>
        </Tabs>
      </section>

      {/* Tooltips */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Tooltips</h2>
        <TooltipProvider>
          <div className="flex gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary">Hover for tooltip (top)</Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                This is a tooltip on top
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary">Hover for tooltip (bottom)</Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" title="Tooltip Title">
                This tooltip has a title
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </section>
    </div>
  );
}
