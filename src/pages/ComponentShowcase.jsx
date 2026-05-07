import React, { useState } from 'react'
import {
  Container,
  Stack,
  HStack,
  Grid,
  Text,
  Card,
  Badge,
  Chip,
  Avatar,
  Button,
  Input,
  TextArea,
  Select,
  Checkbox,
  Radio,
  Toggle,
  NewsCard,
  MarketplaceCard,
  MandiRateCard,
  WeatherCard,
  EventCard,
  SkeletonNewsCard,
  Spinner,
  Modal,
  BottomSheet,
  ConfirmDialog,
  Toast,
  ToastContainer,
  LazyImage
} from './ui'
import { mockNews, mockMarketplaceItems, mandiRates, weatherData, events } from '@/data/mockData'
import { Heart, MessageCircle, Share2, MapPin, Phone } from 'lucide-react'

export const ComponentShowcase = () => {
  // State for interactive components
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    category: '',
    agreed: false,
    notification: true,
    gender: ''
  })

  const [modals, setModals] = useState({
    form: false,
    confirmation: false,
    detail: false
  })

  const [toasts, setToasts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const showToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts([...toasts, { id, message, type, autoClose: true }])
  }

  const handleFormSubmit = () => {
    if (!formData.name || !formData.email) {
      showToast('Please fill all fields', 'error')
      return
    }
    showToast('Form submitted successfully!', 'success')
    setModals({ ...modals, form: false })
    setFormData({ name: '', email: '', message: '', category: '', agreed: false, notification: true, gender: '' })
  }

  return (
    <Container size="lg" className="py-8 space-y-12">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={(id) => setToasts(toasts.filter(t => t.id !== id))} />

      {/* Modals */}
      <Modal isOpen={modals.form} onClose={() => setModals({ ...modals, form: false })} title="Form Example" size="md">
        <Stack gap={4}>
          <Input label="Name" placeholder="Enter name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <Input label="Email" type="email" placeholder="Enter email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <TextArea label="Message" placeholder="Enter message" rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} maxLength={200} />
          <Select label="Category" placeholder="Select category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} options={[{ label: 'News', value: 'news' }, { label: 'Farming', value: 'farming' }, { label: 'Market', value: 'market' }]} />
          <Checkbox label="I agree to terms" checked={formData.agreed} onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })} />
          <div className="flex gap-2">
            <button onClick={() => setModals({ ...modals, form: false })} className="flex-1 px-4 py-2 rounded-lg border border-neutral-300 font-semibold hover:bg-neutral-50 transition">Cancel</button>
            <button onClick={handleFormSubmit} className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition">Submit</button>
          </div>
        </Stack>
      </Modal>

      {/* Layout & Typography */}
      <section>
        <Text variant="headingXL" className="mb-4">Typography & Layout System</Text>
        <Stack gap={4}>
          <Card className="p-6">
            <Stack gap={3}>
              <Text variant="displayXL">Display XL - Hero Headlines</Text>
              <Text variant="displayL">Display L - Large Headlines</Text>
              <Text variant="headingXL">Heading XL - Section Titles</Text>
              <Text variant="headingM">Heading M - Card Titles</Text>
              <Text variant="body">Body text - Regular content reading</Text>
              <Text variant="bodyS">Body Small - Secondary text, captions</Text>
            </Stack>
          </Card>

          <Card className="p-6">
            <Text variant="headingL" className="mb-4">Responsive Grid Example</Text>
            <Grid cols={3} gap={4}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-4 text-center">
                  <p className="font-bold text-green-600">Card {i + 1}</p>
                </Card>
              ))}
            </Grid>
          </Card>
        </Stack>
      </section>

      {/* Badges & Chips */}
      <section>
        <Text variant="headingXL" className="mb-4">Badges & Chips</Text>
        <Stack gap={4}>
          <Card className="p-6">
            <Text variant="headingM" className="mb-4">Badge Variants</Text>
            <HStack gap={3} className="flex-wrap">
              <Badge>Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="breaking">Breaking</Badge>
              <Badge variant="verified">Verified</Badge>
              <Badge variant="trending">Trending</Badge>
            </HStack>
          </Card>

          <Card className="p-6">
            <Text variant="headingM" className="mb-4">Chip Variants</Text>
            <HStack gap={2} className="flex-wrap">
              <Chip label="News" />
              <Chip label="Farming" selected />
              <Chip label="Removable" onClose={() => {}} />
            </HStack>
          </Card>

          <Card className="p-6">
            <Text variant="headingM" className="mb-4">Avatars</Text>
            <HStack gap={4} className="items-center flex-wrap">
              <Avatar name="John Doe" size="sm" />
              <Avatar name="Jane Smith" size="md" verified />
              <Avatar name="Admin" size="lg" />
            </HStack>
          </Card>
        </Stack>
      </section>

      {/* Buttons */}
      <section>
        <Text variant="headingXL" className="mb-4">Button Variants & Sizes</Text>
        <Stack gap={4}>
          {['primary', 'secondary', 'outline', 'ghost', 'danger', 'success', 'warning', 'gradient'].map((variant) => (
            <Card key={variant} className="p-6">
              <Text variant="headingM" className="mb-3 capitalize">{variant} Buttons</Text>
              <HStack gap={2} className="flex-wrap">
                <Button variant={variant} size="sm">Small</Button>
                <Button variant={variant}>Medium (Default)</Button>
                <Button variant={variant} size="lg">Large</Button>
                <Button variant={variant} disabled>Disabled</Button>
                <Button variant={variant} loading>Loading</Button>
              </HStack>
            </Card>
          ))}
        </Stack>
      </section>

      {/* Form Inputs */}
      <section>
        <Text variant="headingXL" className="mb-4">Form Components</Text>
        <Card className="p-6">
          <Stack gap={4}>
            <Input label="Text Input" placeholder="Enter text" />
            <Input label="Email" type="email" placeholder="Enter email" error="Invalid email format" />
            <Input label="Password" type="password" placeholder="Enter password" />
            <TextArea label="Message" placeholder="Enter your message" maxLength={150} />
            <Select label="Category" placeholder="Select option" options={[{ label: 'Option 1', value: '1' }, { label: 'Option 2', value: '2' }]} />
            <HStack gap={4}>
              <Checkbox label="Agree to terms" />
              <Radio label="Option 1" name="demo" value="1" />
              <Toggle label="Enable notifications" />
            </HStack>
            <button onClick={() => setModals({ ...modals, form: true })} className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition">
              Open Form Modal
            </button>
          </Stack>
        </Card>
      </section>

      {/* Feature Cards */}
      <section>
        <Text variant="headingXL" className="mb-4">Feature Cards</Text>
        <Stack gap={4}>
          {/* News Cards */}
          <div>
            <Text variant="headingM" className="mb-3">News Cards</Text>
            <Stack gap={4}>
              {mockNews.slice(0, 2).map((news) => (
                <NewsCard
                  key={news.id}
                  news={news}
                  onBookmark={() => showToast('Bookmarked!')}
                  onShare={() => showToast('Shared!')}
                  onComment={() => showToast('Commenting...')}
                />
              ))}
            </Stack>
          </div>

          {/* Marketplace Cards */}
          <div>
            <Text variant="headingM" className="mb-3">Marketplace Listings</Text>
            <Grid cols={2} gap={4}>
              {mockMarketplaceItems.map((item) => (
                <MarketplaceCard
                  key={item.id}
                  item={item}
                  onContact={() => showToast('Opening chat...')}
                  onCall={() => showToast('Calling seller...')}
                />
              ))}
            </Grid>
          </div>

          {/* Mandi Rates */}
          <div>
            <Text variant="headingM" className="mb-3">Mandi Rates</Text>
            <Grid cols={2} gap={4} className="md:grid-cols-4">
              {mandiRates.map((rate) => (
                <MandiRateCard key={rate.id} item={rate} />
              ))}
            </Grid>
          </div>

          {/* Weather */}
          <div>
            <Text variant="headingM" className="mb-3">Weather Information</Text>
            <Grid cols={2} gap={4} className="md:grid-cols-3">
              <WeatherCard weather={{ label: 'Temperature', value: '32°C', unit: 'Celsius' }} />
              <WeatherCard weather={{ label: 'Humidity', value: '65%', unit: 'Percentage' }} />
              <WeatherCard weather={{ label: 'Wind Speed', value: '12 km/h', unit: 'Speed' }} />
            </Grid>
          </div>

          {/* Events */}
          <div>
            <Text variant="headingM" className="mb-3">Events</Text>
            <Grid cols={2} gap={4}>
              {events.slice(0, 2).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </Grid>
          </div>
        </Stack>
      </section>

      {/* Loading States */}
      <section>
        <Text variant="headingXL" className="mb-4">Loading States</Text>
        <Stack gap={4}>
          <Card className="p-6">
            <Text variant="headingM" className="mb-4">Skeleton Loaders</Text>
            <Stack gap={4}>
              {Array.from({ length: 2 }).map((_, i) => (
                <SkeletonNewsCard key={i} />
              ))}
            </Stack>
          </Card>

          <Card className="p-6 flex items-center justify-center gap-6 min-h-[200px]">
            <div className="text-center">
              <Spinner size="sm" className="mx-auto mb-2" />
              <p className="text-sm text-neutral-600">Small</p>
            </div>
            <div className="text-center">
              <Spinner size="md" className="mx-auto mb-2" />
              <p className="text-sm text-neutral-600">Medium</p>
            </div>
            <div className="text-center">
              <Spinner size="lg" className="mx-auto mb-2" />
              <p className="text-sm text-neutral-600">Large</p>
            </div>
          </Card>
        </Stack>
      </section>

      {/* Demo Interactive Buttons */}
      <section>
        <Text variant="headingXL" className="mb-4">Interactive Demo</Text>
        <Card className="p-6">
          <Stack gap={3}>
            <Button onClick={() => showToast('Success! Action completed.')}>Show Success Toast</Button>
            <Button variant="warning" onClick={() => showToast('Warning: Check your input', 'warning')}>Show Warning Toast</Button>
            <Button variant="danger" onClick={() => showToast('Error occurred!', 'error')}>Show Error Toast</Button>
            <Button onClick={() => setModals({ ...modals, confirmation: true })}>Show Confirmation Dialog</Button>
            <Button variant="secondary" onClick={() => setIsLoading(!isLoading)}>{isLoading ? 'Hide Loading' : 'Show Loading'}</Button>
          </Stack>
        </Card>
      </section>
    </Container>
  )
}

export default ComponentShowcase
