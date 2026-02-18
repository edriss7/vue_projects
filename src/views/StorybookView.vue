<template>
  <div class="sb-layout">
    <!-- ── Sidebar ── -->
    <nav class="sb-sidebar">
      <div class="sb-logo">
        <RouterLink to="/" class="sb-home-link">← Home</RouterLink>
        <div style="font-weight:800;font-size:1.1rem;margin-top:8px">Storybook</div>
        <div style="font-size:0.75rem;color:var(--text2)">Vue 3 Component Library</div>
      </div>
      <div class="sb-search">
        <input v-model="search" class="sb-search-input" placeholder="Search components…" />
      </div>
      <div class="sb-nav">
        <div v-for="group in filteredGroups" :key="group.label">
          <div class="sb-group-label">{{ group.label }}</div>
          <a v-for="item in group.items" :key="item.id"
            :href="'#' + item.id" class="sb-nav-link"
            :class="{ active: activeSection === item.id }"
            @click.prevent="scrollTo(item.id)">{{ item.label }}</a>
        </div>
      </div>
    </nav>

    <!-- ── Main ── -->
    <main class="sb-main" ref="mainEl">
      <div class="sb-page-header">
        <div class="sb-page-breadcrumb">{{ currentGroupLabel }}</div>
        <div class="sb-page-title-row">
          <h1 class="sb-page-title">{{ currentSectionLabel }}</h1>
          <div class="sb-page-nav">
            <button class="btn btn-secondary btn-sm" :disabled="!prevId" @click="prevId && scrollTo(prevId)">← Prev</button>
            <button class="btn btn-secondary btn-sm" :disabled="!nextId" @click="nextId && scrollTo(nextId)">Next →</button>
          </div>
        </div>
      </div>

      <!-- ════════════════ FOUNDATION ════════════════ -->
      <section :id="sid('colors')" v-show="activeSection === 'colors'" class="sb-section">
        <h2 class="sb-section-title">Colors</h2>
        <p class="sb-section-desc">CSS custom properties via <code>var(--name)</code>.</p>
        <div class="sb-color-grid">
          <div v-for="c in colors" :key="c.name" class="sb-color-swatch">
            <div class="sb-color-box" :style="{ background: c.value }" />
            <div class="sb-color-name">{{ c.name }}</div>
            <div class="sb-color-val">{{ c.value }}</div>
          </div>
        </div>
      </section>

      <section :id="sid('typography')" v-show="activeSection === 'typography'" class="sb-section">
        <h2 class="sb-section-title">Typography</h2>
        <p class="sb-section-desc">Base font: <code>Segoe UI, system-ui, sans-serif</code>.</p>
        <SbStory :code="typographyCode">
          <h1 style="font-size:2.5rem;font-weight:800;letter-spacing:-1px">Heading 1</h1>
          <h2 style="font-size:1.8rem;font-weight:700;margin-top:8px">Heading 2</h2>
          <h3 style="font-size:1.3rem;font-weight:700;margin-top:8px">Heading 3</h3>
          <p style="margin-top:10px">Body — <code style="background:var(--bg3);padding:2px 6px;border-radius:4px">0.95rem</code></p>
          <p style="color:var(--text2);font-size:0.85rem;margin-top:6px">Muted — <code style="background:var(--bg3);padding:2px 6px;border-radius:4px">var(--text2)</code></p>
          <p style="font-family:monospace;margin-top:6px;font-size:0.88rem">Monospace — code, inputs, outputs</p>
        </SbStory>
      </section>

      <section :id="sid('layout')" v-show="activeSection === 'layout'" class="sb-section">
        <h2 class="sb-section-title">Layout Utilities</h2>
        <p class="sb-section-desc">Spacing, flex rows, and dividers.</p>
        <SbStory :code="layoutCode">
          <div style="display:flex;flex-direction:column;gap:4px;font-size:0.85rem">
            <div v-for="u in layoutUtils" :key="u.cls"
              style="display:flex;gap:12px;padding:6px 10px;background:var(--bg3);border-radius:6px">
              <code style="color:var(--accent2);min-width:100px">{{ u.cls }}</code>
              <span style="color:var(--text2)">{{ u.desc }}</span>
            </div>
          </div>
          <div class="divider" style="margin:14px 0" />
          <div class="row" style="gap:8px">
            <button class="btn btn-secondary btn-sm">Item 1</button>
            <button class="btn btn-secondary btn-sm">Item 2</button>
            <button class="btn btn-secondary btn-sm">Item 3</button>
          </div>
        </SbStory>
      </section>

      <section :id="sid('spacing')" v-show="activeSection === 'spacing'" class="sb-section">
        <h2 class="sb-section-title">Spacing Scale</h2>
        <p class="sb-section-desc">Base-4 spacing system — multiply by 4 for pixel value.</p>
        <SbStory :code="spacingCode">
          <div style="display:flex;flex-direction:column;gap:8px">
            <div v-for="sp in spacingScale" :key="sp.name" style="display:flex;align-items:center;gap:12px">
              <span style="font-family:monospace;font-size:.78rem;color:var(--accent2);min-width:36px">{{ sp.name }}</span>
              <div :style="{ width: sp.px + 'px', height:'20px', background:'var(--accent)', borderRadius:'3px', flexShrink:0 }" />
              <span style="font-size:.78rem;color:var(--text2)">{{ sp.px }}px</span>
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('shadows')" v-show="activeSection === 'shadows'" class="sb-section">
        <h2 class="sb-section-title">Shadows</h2>
        <p class="sb-section-desc">Elevation system using layered box-shadows.</p>
        <SbStory :code="shadowCode">
          <div style="display:flex;gap:24px;flex-wrap:wrap;padding:16px 0">
            <div v-for="sh in shadowLevels" :key="sh.name"
              style="background:var(--bg2);border-radius:10px;padding:20px 24px;min-width:120px;text-align:center"
              :style="{ boxShadow: sh.value }">
              <div style="font-weight:700;font-size:.88rem">{{ sh.name }}</div>
              <div style="font-size:.72rem;color:var(--text2);margin-top:4px;font-family:monospace">{{ sh.label }}</div>
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('borders')" v-show="activeSection === 'borders'" class="sb-section">
        <h2 class="sb-section-title">Borders &amp; Radius</h2>
        <p class="sb-section-desc">Border radius tokens from <code>none</code> to <code>full</code>.</p>
        <SbStory :code="bordersCode">
          <div style="display:flex;gap:20px;flex-wrap:wrap;align-items:flex-end">
            <div v-for="br in borderRadii" :key="br.name" style="display:flex;flex-direction:column;align-items:center;gap:8px">
              <div style="width:64px;height:64px;background:var(--accent);opacity:.7"
                :style="{ borderRadius: br.value }" />
              <span style="font-size:.75rem;font-weight:700;color:var(--accent2);font-family:monospace">{{ br.name }}</span>
              <span style="font-size:.7rem;color:var(--text2)">{{ br.value }}</span>
            </div>
          </div>
        </SbStory>
      </section>

      <!-- ════════════════ CONTROLS ════════════════ -->
      <section :id="sid('buttons')" v-show="activeSection === 'buttons'" class="sb-section">
        <h2 class="sb-section-title">Buttons</h2>
        <p class="sb-section-desc"><code>.btn</code> base + variant + optional size modifier.</p>
        <h3 class="sb-sub">Variants</h3>
        <SbStory :code="btnVariantsCode" row>
          <button class="btn btn-primary">Primary</button>
          <button class="btn btn-secondary">Secondary</button>
          <button class="btn btn-success">Success</button>
          <button class="btn btn-danger">Danger</button>
          <button class="btn btn-warn">Warning</button>
        </SbStory>
        <h3 class="sb-sub">Sizes</h3>
        <SbStory :code="btnSizesCode" row>
          <button class="btn btn-primary">Default</button>
          <button class="btn btn-primary btn-sm">Small (.btn-sm)</button>
        </SbStory>
        <h3 class="sb-sub">Disabled</h3>
        <SbStory :code="btnDisabledCode" row>
          <button class="btn btn-primary" disabled>Primary</button>
          <button class="btn btn-secondary" disabled>Secondary</button>
          <button class="btn btn-danger" disabled>Danger</button>
        </SbStory>
      </section>

      <section :id="sid('inputs')" v-show="activeSection === 'inputs'" class="sb-section">
        <h2 class="sb-section-title">Inputs</h2>
        <p class="sb-section-desc"><code>.input</code> on any form control.</p>
        <h3 class="sb-sub">Text / Textarea / Select</h3>
        <SbStory :code="inputTextCode">
          <label class="label">Text Input</label>
          <input class="input" placeholder="Placeholder…" />
          <label class="label mt2">Textarea</label>
          <textarea class="input" placeholder="Multi-line…" style="min-height:60px" />
          <label class="label mt2">Select</label>
          <select class="input"><option>Option A</option><option>Option B</option></select>
        </SbStory>
        <h3 class="sb-sub">Range &amp; Checkboxes</h3>
        <SbStory :code="inputCheckCode">
          <label class="label">Slider — {{ sliderVal }}</label>
          <input v-model.number="sliderVal" type="range" min="0" max="100" style="width:100%;accent-color:var(--accent)" />
          <div style="display:flex;flex-direction:column;gap:8px;margin-top:12px">
            <label class="checkbox-row"><input type="checkbox" checked style="accent-color:var(--accent);width:16px;height:16px" /> Checked</label>
            <label class="checkbox-row"><input type="checkbox" style="accent-color:var(--accent);width:16px;height:16px" /> Unchecked</label>
            <label class="checkbox-row"><input type="radio" name="rb" checked style="accent-color:var(--accent);width:16px;height:16px" /> Radio A</label>
            <label class="checkbox-row"><input type="radio" name="rb" style="accent-color:var(--accent);width:16px;height:16px" /> Radio B</label>
          </div>
        </SbStory>
      </section>

      <section :id="sid('badges')" v-show="activeSection === 'badges'" class="sb-section">
        <h2 class="sb-section-title">Badges</h2>
        <p class="sb-section-desc"><code>.badge</code> + color modifier.</p>
        <SbStory :code="badgeCode" row>
          <span class="badge badge-blue">Blue</span>
          <span class="badge badge-green">Green</span>
          <span class="badge badge-yellow">Yellow</span>
          <span class="badge badge-red">Red</span>
        </SbStory>
      </section>

      <section :id="sid('alerts')" v-show="activeSection === 'alerts'" class="sb-section">
        <h2 class="sb-section-title">Alerts</h2>
        <p class="sb-section-desc"><code>.msg</code> + variant class.</p>
        <SbStory :code="alertCode">
          <div class="msg msg-success">✓ Operation completed successfully.</div>
          <div class="msg msg-error" style="margin-top:6px">✗ Something went wrong.</div>
          <div class="msg msg-info" style="margin-top:6px">ℹ Informational message.</div>
          <div class="msg" style="margin-top:6px;background:rgba(245,158,11,0.15);color:var(--yellow);border:1px solid rgba(245,158,11,0.3)">⚠ Warning message.</div>
        </SbStory>
      </section>

      <section :id="sid('cards')" v-show="activeSection === 'cards'" class="sb-section">
        <h2 class="sb-section-title">Cards</h2>
        <p class="sb-section-desc"><code>.card</code> — padded container with bg2, border, radius.</p>
        <SbStory :code="cardCode">
          <div class="card">
            <h3 style="margin-bottom:8px">Card Title</h3>
            <p style="color:var(--text2);font-size:0.9rem;margin-bottom:16px">Cards are the root container for every project page.</p>
            <button class="btn btn-primary btn-sm">Action</button>
          </div>
        </SbStory>
      </section>

      <section :id="sid('stat-grid')" v-show="activeSection === 'stat-grid'" class="sb-section">
        <h2 class="sb-section-title">Stat Grid</h2>
        <p class="sb-section-desc"><code>.stat-grid</code> + <code>.stat-box</code>.</p>
        <SbStory :code="statGridCode">
          <div class="stat-grid">
            <div class="stat-box"><div class="val" style="color:var(--green)">$12,400</div><div class="lbl">Revenue</div></div>
            <div class="stat-box"><div class="val" style="color:var(--accent)">1,284</div><div class="lbl">Users</div></div>
            <div class="stat-box"><div class="val" style="color:var(--accent2)">94.2%</div><div class="lbl">Uptime</div></div>
            <div class="stat-box"><div class="val" style="color:var(--red)">3</div><div class="lbl">Errors</div></div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('progress')" v-show="activeSection === 'progress'" class="sb-section">
        <h2 class="sb-section-title">Progress Bar</h2>
        <p class="sb-section-desc"><code>.progress-bar</code> + <code>.progress-fill</code>.</p>
        <SbStory :code="progressCode">
          <div style="display:flex;flex-direction:column;gap:10px">
            <div>
              <div style="display:flex;justify-content:space-between;font-size:0.78rem;color:var(--text2);margin-bottom:4px"><span>Default</span><span>{{ sliderVal }}%</span></div>
              <div class="progress-bar"><div class="progress-fill" :style="{ width: sliderVal + '%' }" /></div>
            </div>
            <div class="progress-bar"><div class="progress-fill" style="width:60%;background:var(--green)" /></div>
            <div class="progress-bar"><div class="progress-fill" style="width:85%;background:var(--red)" /></div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('toggle')" v-show="activeSection === 'toggle'" class="sb-section">
        <h2 class="sb-section-title">Toggle Switch</h2>
        <SbStory :code="toggleCode" row>
          <label v-for="(tog, i) in toggles" :key="i" class="sb-toggle-wrap">
            <input type="checkbox" v-model="tog.on" style="display:none" />
            <div class="sb-toggle" :class="{ on: tog.on }"><div class="sb-toggle-thumb" /></div>
            <span style="font-size:0.9rem">{{ tog.label }}</span>
          </label>
        </SbStory>
      </section>

      <section :id="sid('tabs')" v-show="activeSection === 'tabs'" class="sb-section">
        <h2 class="sb-section-title">Tabs</h2>
        <SbStory :code="tabsCode">
          <div class="sb-tabs">
            <button v-for="t in tabItems" :key="t" class="sb-tab" :class="{ active: activeTab === t }" @click="activeTab = t">{{ t }}</button>
          </div>
          <div style="padding:14px 16px;background:var(--bg);border-radius:0 0 8px 8px;font-size:0.9rem;color:var(--text2)">
            Content for <strong style="color:var(--text)">{{ activeTab }}</strong>
          </div>
        </SbStory>
      </section>

      <section :id="sid('avatars')" v-show="activeSection === 'avatars'" class="sb-section">
        <h2 class="sb-section-title">Avatars</h2>
        <SbStory :code="avatarCode" row>
          <div v-for="av in avatars" :key="av.initials" style="display:flex;flex-direction:column;align-items:center;gap:6px">
            <div :style="{ width:av.size+'px', height:av.size+'px', borderRadius:'50%', background:av.color, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'700', fontSize:(av.size*0.38)+'px', color:'#fff' }">{{ av.initials }}</div>
            <span style="font-size:0.72rem;color:var(--text2)">{{ av.label }}</span>
          </div>
        </SbStory>
      </section>

      <section :id="sid('spinner')" v-show="activeSection === 'spinner'" class="sb-section">
        <h2 class="sb-section-title">Spinner</h2>
        <SbStory :code="spinnerCode" row>
          <div v-for="s in spinners" :key="s.size" style="display:flex;flex-direction:column;align-items:center;gap:8px">
            <div class="sb-spinner" :style="{ width:s.size+'px', height:s.size+'px', borderWidth:s.border+'px', borderColor:s.color+'33', borderTopColor:s.color }" />
            <span style="font-size:0.72rem;color:var(--text2)">{{ s.label }}</span>
          </div>
        </SbStory>
      </section>

      <section :id="sid('tooltip')" v-show="activeSection === 'tooltip'" class="sb-section">
        <h2 class="sb-section-title">Tooltip</h2>
        <p class="sb-section-desc">CSS-only via <code>.sb-tip[data-tip]</code> or Vue-driven with arrow and pin-to-open.</p>
        <h3 class="sb-sub">CSS Hover Variants (hover to see)</h3>
        <SbStory :code="tooltipCode" row>
          <span class="sb-tip" data-tip="Default dark tooltip">
            <button class="btn btn-secondary">Default</button>
          </span>
          <span class="sb-tip sb-tip-success" data-tip="✓ Saved successfully">
            <button class="btn btn-success btn-sm">Success</button>
          </span>
          <span class="sb-tip sb-tip-error" data-tip="✗ Upload failed">
            <button class="btn btn-danger btn-sm">Error</button>
          </span>
          <span class="sb-tip sb-tip-warn" data-tip="⚠ Low storage space">
            <button class="btn btn-warn btn-sm">Warning</button>
          </span>
        </SbStory>
        <h3 class="sb-sub">Vue-driven with Arrow (hover or click to pin)</h3>
        <SbStory :code="tooltipVueCode">
          <div style="display:flex;gap:36px;justify-content:center;padding:52px 20px 16px;flex-wrap:wrap">
            <div v-for="(tt, i) in tooltipDemos" :key="i" style="position:relative;display:inline-flex">
              <button class="btn" :class="tipPin===i ? 'btn-primary' : 'btn-secondary'"
                @mouseenter="tipHover=i" @mouseleave="tipHover=null"
                @click="tipPin = tipPin===i ? null : i">
                {{ tt.label }}
              </button>
              <transition name="sb-tip-fade">
                <div v-if="tipHover===i || tipPin===i" class="sb-tip-bubble">
                  {{ tt.text }}
                  <div class="sb-tip-arrow" />
                </div>
              </transition>
            </div>
          </div>
          <p style="font-size:.75rem;color:var(--text2);text-align:center">Hover to show · Click to pin open</p>
        </SbStory>
      </section>

      <section :id="sid('skeleton')" v-show="activeSection === 'skeleton'" class="sb-section">
        <h2 class="sb-section-title">Skeleton Loader</h2>
        <SbStory :code="skeletonCode">
          <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px">
            <div class="sb-skeleton" style="width:48px;height:48px;border-radius:50%;flex-shrink:0" />
            <div style="flex:1;display:flex;flex-direction:column;gap:8px">
              <div class="sb-skeleton" style="height:14px;width:60%;border-radius:6px" />
              <div class="sb-skeleton" style="height:12px;width:40%;border-radius:6px" />
            </div>
          </div>
          <div class="sb-skeleton" style="height:12px;border-radius:6px;margin-bottom:6px" />
          <div class="sb-skeleton" style="height:12px;width:80%;border-radius:6px;margin-bottom:6px" />
          <div class="sb-skeleton" style="height:12px;width:60%;border-radius:6px" />
        </SbStory>
      </section>

      <section :id="sid('modal')" v-show="activeSection === 'modal'" class="sb-section">
        <h2 class="sb-section-title">Modal</h2>
        <p class="sb-section-desc">Overlay dialog with backdrop, click-outside dismiss, and multiple variants.</p>
        <h3 class="sb-sub">Preview</h3>
        <SbStory :code="modalPreviewCode">
          <div style="background:rgba(0,0,0,.55);border-radius:12px;padding:28px 16px;display:flex;align-items:center;justify-content:center">
            <div style="background:var(--bg2);border:1px solid var(--bg3);border-radius:14px;padding:24px 28px;width:380px;max-width:100%;box-shadow:0 20px 60px rgba(0,0,0,.6)">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
                <h3 style="font-size:1.05rem;font-weight:700">Delete Project?</h3>
                <button style="background:none;border:none;color:var(--text2);cursor:pointer;font-size:1.1rem;opacity:.6;padding:2px 6px">✕</button>
              </div>
              <p style="color:var(--text2);font-size:.88rem;line-height:1.6;margin-bottom:20px">
                <strong style="color:var(--red)">vue-storybook</strong> will be permanently deleted. This action cannot be undone.
              </p>
              <div style="display:flex;gap:8px;justify-content:flex-end">
                <button class="btn btn-secondary btn-sm">Cancel</button>
                <button class="btn btn-danger btn-sm">Delete Project</button>
              </div>
            </div>
          </div>
        </SbStory>
        <h3 class="sb-sub">Live</h3>
        <SbStory :code="modalCode" row>
          <button class="btn btn-primary" @click="modalOpen = true">Basic Modal</button>
          <button class="btn btn-danger" @click="modalDelete = true">Delete Dialog</button>
          <button class="btn btn-secondary" @click="modalForm = true">Form Modal</button>
        </SbStory>
        <Teleport to="body">
          <!-- Basic -->
          <div v-if="modalOpen" style="position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:1000" @click.self="modalOpen=false">
            <div style="background:var(--bg2);border:1px solid var(--bg3);border-radius:14px;padding:28px;width:400px;max-width:90vw">
              <h3 style="margin-bottom:10px">Modal Title</h3>
              <p style="color:var(--text2);font-size:0.9rem;margin-bottom:20px">Click outside or use the buttons to close.</p>
              <div class="row" style="gap:8px;justify-content:flex-end">
                <button class="btn btn-secondary" @click="modalOpen=false">Cancel</button>
                <button class="btn btn-primary" @click="modalOpen=false">Confirm</button>
              </div>
            </div>
          </div>
          <!-- Delete confirm -->
          <div v-if="modalDelete" style="position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:1000" @click.self="modalDelete=false">
            <div style="background:var(--bg2);border:1px solid rgba(239,68,68,0.3);border-radius:14px;padding:28px;width:380px;max-width:90vw">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
                <div style="width:40px;height:40px;border-radius:50%;background:rgba(239,68,68,.15);display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0">🗑</div>
                <h3 style="font-size:1.05rem">Delete Project?</h3>
              </div>
              <p style="color:var(--text2);font-size:0.88rem;margin-bottom:20px;line-height:1.6">This action cannot be undone. The project and all its data will be permanently removed.</p>
              <div class="row" style="gap:8px;justify-content:flex-end">
                <button class="btn btn-secondary" @click="modalDelete=false">Cancel</button>
                <button class="btn btn-danger" @click="modalDelete=false">Delete</button>
              </div>
            </div>
          </div>
          <!-- Form modal -->
          <div v-if="modalForm" style="position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:1000" @click.self="modalForm=false">
            <div style="background:var(--bg2);border:1px solid var(--bg3);border-radius:14px;padding:28px;width:420px;max-width:90vw">
              <h3 style="margin-bottom:16px">Edit Profile</h3>
              <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:20px">
                <div><label class="label">Name</label><input class="input" value="Alice Johnson" /></div>
                <div><label class="label">Email</label><input class="input" value="alice@example.com" type="email" /></div>
              </div>
              <div class="row" style="gap:8px;justify-content:flex-end">
                <button class="btn btn-secondary" @click="modalForm=false">Cancel</button>
                <button class="btn btn-primary" @click="modalForm=false">Save Changes</button>
              </div>
            </div>
          </div>
        </Teleport>
      </section>

      <section :id="sid('flashcard')" v-show="activeSection === 'flashcard'" class="sb-section">
        <h2 class="sb-section-title">Flashcard</h2>
        <SbStory :code="flashcardCode">
          <div class="flashcard" :class="{ answer: cardFlipped }" @click="cardFlipped = !cardFlipped" style="max-width:400px">
            {{ cardFlipped ? '42' : 'What is 6 × 7?' }}
          </div>
          <div class="fc-counter">Click to flip</div>
        </SbStory>
      </section>

      <section :id="sid('rating')" v-show="activeSection === 'rating'" class="sb-section">
        <h2 class="sb-section-title">Star Rating</h2>
        <SbStory :code="starsCode">
          <div class="stars">
            <span v-for="i in 5" :key="i" class="star" :class="{ lit: i <= hoverStar || i <= rating }"
              @click="rating = i" @mouseenter="hoverStar = i" @mouseleave="hoverStar = 0">★</span>
          </div>
          <div style="margin-top:8px;color:var(--text2);font-size:0.85rem">Rating: {{ rating }}/5</div>
        </SbStory>
      </section>

      <section :id="sid('chips')" v-show="activeSection === 'chips'" class="sb-section">
        <h2 class="sb-section-title">Chips / Tags</h2>
        <SbStory :code="chipsCode" row>
          <span v-for="chip in chips" :key="chip"
            style="display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:999px;background:var(--accent);color:#fff;font-size:0.82rem">
            {{ chip }}
            <button @click="chips = chips.filter(c=>c!==chip)" style="background:none;border:none;cursor:pointer;color:#fff;opacity:0.8;padding:0;line-height:1">✕</button>
          </span>
          <button class="btn btn-secondary btn-sm" @click="chips=['Vue 3','TypeScript','Vite','Router','Pinia']">Reset</button>
        </SbStory>
      </section>

      <section :id="sid('kbd')" v-show="activeSection === 'kbd'" class="sb-section">
        <h2 class="sb-section-title">Keyboard Keys</h2>
        <SbStory :code="kbdCode" row>
          <span style="color:var(--text2);font-size:0.88rem">Press</span>
          <kbd>Ctrl</kbd><span style="color:var(--text2)">+</span><kbd>K</kbd>
          <span style="color:var(--text2)">to search, or</span>
          <kbd>⌘</kbd><span style="color:var(--text2)">+</span><kbd>Enter</kbd>
          <span style="color:var(--text2)">to submit</span>
        </SbStory>
      </section>

      <section :id="sid('checkbox')" v-show="activeSection === 'checkbox'" class="sb-section">
        <h2 class="sb-section-title">Checkbox Group</h2>
        <p class="sb-section-desc">Multi-select checkboxes with indeterminate state support.</p>
        <SbStory :code="checkboxCode">
          <div style="display:flex;flex-direction:column;gap:10px">
            <label style="display:flex;align-items:center;gap:10px;cursor:pointer">
              <input type="checkbox" :indeterminate.prop="cbIndeterminate" :checked="cbAll"
                @change="toggleAllCb" style="width:16px;height:16px;cursor:pointer;accent-color:var(--accent)" />
              <span style="font-weight:700;font-size:.92rem">Select all</span>
              <span style="font-size:.8rem;color:var(--text2)">({{ cbItems.filter(i=>i.checked).length }}/{{ cbItems.length }})</span>
            </label>
            <div class="divider" />
            <label v-for="item in cbItems" :key="item.label" style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:2px 0">
              <input type="checkbox" v-model="item.checked" style="width:16px;height:16px;cursor:pointer;accent-color:var(--accent)" />
              <span style="font-size:.9rem">{{ item.label }}</span>
              <span class="badge" :class="item.badge" style="font-size:.7rem">{{ item.tag }}</span>
            </label>
          </div>
        </SbStory>
      </section>

      <section :id="sid('radio')" v-show="activeSection === 'radio'" class="sb-section">
        <h2 class="sb-section-title">Radio Group</h2>
        <p class="sb-section-desc">Single-select radio buttons with visual card variant.</p>
        <h3 class="sb-sub">Standard</h3>
        <SbStory :code="radioCode">
          <div style="display:flex;flex-direction:column;gap:8px">
            <label v-for="opt in radioOptions" :key="opt.value"
              style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:6px 10px;border-radius:8px;border:1px solid transparent;transition:all .15s"
              :style="radioSelected===opt.value ? 'border-color:var(--accent);background:rgba(99,102,241,.1)' : 'border-color:var(--bg3)'">
              <input type="radio" :value="opt.value" v-model="radioSelected" style="accent-color:var(--accent);cursor:pointer" />
              <span>{{ opt.label }}</span>
              <span style="margin-left:auto;font-size:.78rem;color:var(--text2)">{{ opt.desc }}</span>
            </label>
          </div>
        </SbStory>
      </section>

      <section :id="sid('stepper-input')" v-show="activeSection === 'stepper-input'" class="sb-section">
        <h2 class="sb-section-title">Number Stepper</h2>
        <p class="sb-section-desc">Increment / decrement numeric input with min, max, and step.</p>
        <SbStory :code="stepperInputCode" row>
          <div v-for="ns in numSteppers" :key="ns.label" style="display:flex;flex-direction:column;gap:6px;align-items:center">
            <span style="font-size:.78rem;color:var(--text2)">{{ ns.label }}</span>
            <div style="display:flex;align-items:center;gap:0;border:1px solid var(--bg3);border-radius:8px;overflow:hidden">
              <button class="btn btn-secondary btn-sm" style="border-radius:0;border:none;padding:8px 14px"
                :disabled="ns.val <= ns.min" @click="ns.val = Math.max(ns.min, ns.val - ns.step)">−</button>
              <span style="padding:8px 16px;font-family:monospace;font-weight:700;min-width:52px;text-align:center;border-left:1px solid var(--bg3);border-right:1px solid var(--bg3)">{{ ns.val }}</span>
              <button class="btn btn-secondary btn-sm" style="border-radius:0;border:none;padding:8px 14px"
                :disabled="ns.val >= ns.max" @click="ns.val = Math.min(ns.max, ns.val + ns.step)">+</button>
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('color-input')" v-show="activeSection === 'color-input'" class="sb-section">
        <h2 class="sb-section-title">Color Input</h2>
        <p class="sb-section-desc">Native color picker styled for the dark theme.</p>
        <SbStory :code="colorInputCode">
          <div style="display:flex;gap:20px;flex-wrap:wrap;align-items:center">
            <div style="display:flex;flex-direction:column;gap:8px">
              <label style="font-size:.82rem;color:var(--text2);font-weight:600">Pick a color</label>
              <div style="display:flex;align-items:center;gap:10px">
                <input type="color" v-model="pickedColor" class="sb-color-picker" />
                <span style="font-family:monospace;font-size:.9rem;font-weight:700">{{ pickedColor }}</span>
              </div>
            </div>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              <button v-for="pc in presetColors" :key="pc"
                style="width:32px;height:32px;border-radius:50%;border:2px solid transparent;cursor:pointer;transition:transform .15s"
                :style="{ background: pc, borderColor: pickedColor===pc ? '#fff' : 'transparent', transform: pickedColor===pc ? 'scale(1.15)' : 'scale(1)' }"
                @click="pickedColor = pc" />
            </div>
          </div>
          <div style="margin-top:12px;padding:14px 18px;border-radius:10px;font-weight:700"
            :style="{ background: pickedColor + '22', borderLeft: '4px solid ' + pickedColor, color: pickedColor }">
            Live preview using selected color
          </div>
        </SbStory>
      </section>

      <section :id="sid('search-input')" v-show="activeSection === 'search-input'" class="sb-section">
        <h2 class="sb-section-title">Search Input</h2>
        <p class="sb-section-desc">Search field with clear button and live result count.</p>
        <SbStory :code="searchInputCode">
          <div style="position:relative;max-width:380px">
            <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text2);font-size:.9rem;pointer-events:none">🔍</span>
            <input v-model="searchQuery" class="input" style="padding-left:36px;padding-right:36px" placeholder="Search frameworks…" />
            <button v-if="searchQuery" @click="searchQuery=''"
              style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--text2);font-size:1rem;line-height:1">✕</button>
          </div>
          <div style="margin-top:10px;display:flex;flex-direction:column;gap:4px">
            <div v-if="searchResults.length === 0" style="font-size:.85rem;color:var(--text2);padding:8px 0">No results found</div>
            <div v-for="r in searchResults" :key="r"
              style="padding:8px 12px;background:var(--bg2);border-radius:6px;font-size:.88rem;border:1px solid var(--bg3)">
              {{ r }}
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('range-slider')" v-show="activeSection === 'range-slider'" class="sb-section">
        <h2 class="sb-section-title">Range Slider</h2>
        <p class="sb-section-desc">Custom styled range inputs — single and dual-handle.</p>
        <SbStory :code="rangeSliderCode">
          <div style="display:flex;flex-direction:column;gap:18px">
            <div v-for="rs in rangeSliders" :key="rs.label">
              <div style="display:flex;justify-content:space-between;margin-bottom:6px">
                <span style="font-size:.82rem;font-weight:600;color:var(--text2)">{{ rs.label }}</span>
                <span style="font-size:.82rem;font-family:monospace;color:var(--accent2)">{{ rs.val }}{{ rs.unit }}</span>
              </div>
              <input type="range" :min="rs.min" :max="rs.max" :step="rs.step"
                v-model.number="rs.val" class="sb-range" :style="{ '--pct': ((rs.val - rs.min) / (rs.max - rs.min) * 100) + '%' }" />
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('select')" v-show="activeSection === 'select'" class="sb-section">
        <h2 class="sb-section-title">Select / Combobox</h2>
        <p class="sb-section-desc">Searchable combobox with keyboard-friendly filtering.</p>
        <SbStory :code="comboboxCode">
          <div style="max-width:320px">
            <div style="position:relative">
              <input v-model="comboQuery" @focus="comboOpen=true" @blur="comboBlur()"
                class="input" placeholder="Search or select a country…"
                style="padding-right:32px" />
              <span style="position:absolute;right:10px;top:50%;transform:translateY(-50%);color:var(--text2);font-size:.75rem;pointer-events:none">▼</span>
            </div>
            <div v-if="comboOpen && comboFiltered.length > 0"
              style="border:1px solid var(--bg3);border-top:none;border-radius:0 0 8px 8px;background:var(--bg2);max-height:200px;overflow-y:auto;z-index:50;position:relative">
              <button v-for="opt in comboFiltered" :key="opt"
                style="width:100%;padding:9px 14px;background:none;border:none;color:var(--text);text-align:left;cursor:pointer;font-size:.88rem;transition:background .1s"
                @mousedown.prevent="comboQuery=opt; comboSelected=opt; comboOpen=false"
                :style="comboSelected===opt ? 'background:rgba(99,102,241,.15);color:var(--accent2)' : ''"
                @mouseenter="e => (e.target as HTMLElement).style.background='var(--bg3)'"
                @mouseleave="e => (e.target as HTMLElement).style.background=comboSelected===opt?'rgba(99,102,241,.15)':''"
              >{{ opt }}</button>
            </div>
            <div v-if="comboSelected" style="margin-top:8px;font-size:.85rem;color:var(--text2)">
              Selected: <strong style="color:var(--text)">{{ comboSelected }}</strong>
            </div>
          </div>
        </SbStory>
      </section>

      <!-- ════════════════ DISPLAY EXTRAS ════════════════ -->

      <section :id="sid('dividers')" v-show="activeSection === 'dividers'" class="sb-section">
        <h2 class="sb-section-title">Dividers</h2>
        <p class="sb-section-desc">Horizontal and vertical separators in multiple styles.</p>
        <SbStory :code="dividersCode">
          <div style="display:flex;flex-direction:column;gap:16px">
            <div class="divider" />
            <div style="height:1px;background:linear-gradient(90deg,transparent,var(--accent),transparent)" />
            <div style="display:flex;align-items:center;gap:12px">
              <div style="flex:1;height:1px;background:var(--bg3)" />
              <span style="font-size:.78rem;color:var(--text2);white-space:nowrap;font-weight:700;text-transform:uppercase;letter-spacing:.08em">or continue with</span>
              <div style="flex:1;height:1px;background:var(--bg3)" />
            </div>
            <div style="height:2px;background:var(--bg3);border-radius:2px" />
            <div style="display:flex;gap:20px;align-items:stretch;height:48px">
              <span style="font-size:.88rem;color:var(--text2)">Item 1</span>
              <div style="width:1px;background:var(--bg3)" />
              <span style="font-size:.88rem;color:var(--text2)">Item 2</span>
              <div style="width:1px;background:var(--bg3)" />
              <span style="font-size:.88rem;color:var(--text2)">Item 3</span>
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('empty-state')" v-show="activeSection === 'empty-state'" class="sb-section">
        <h2 class="sb-section-title">Empty State</h2>
        <p class="sb-section-desc">Placeholder UI for empty lists, search misses, and error states.</p>
        <SbStory :code="emptyStateCode">
          <div style="display:flex;gap:16px;flex-wrap:wrap">
            <div v-for="es in emptyStates" :key="es.title"
              style="flex:1;min-width:200px;display:flex;flex-direction:column;align-items:center;padding:28px 20px;border-radius:12px;border:2px dashed var(--bg3);text-align:center;gap:8px">
              <span style="font-size:2.4rem;line-height:1">{{ es.icon }}</span>
              <span style="font-weight:700;font-size:.92rem">{{ es.title }}</span>
              <span style="font-size:.8rem;color:var(--text2)">{{ es.desc }}</span>
              <button v-if="es.action" class="btn btn-primary btn-sm" style="margin-top:6px">{{ es.action }}</button>
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('list-items')" v-show="activeSection === 'list-items'" class="sb-section">
        <h2 class="sb-section-title">List Items</h2>
        <p class="sb-section-desc">Various list item patterns — plain, icon, description, action.</p>
        <SbStory :code="listItemsCode">
          <div style="display:flex;flex-direction:column;gap:2px;border:1px solid var(--bg3);border-radius:10px;overflow:hidden">
            <div v-for="(item, i) in listItems" :key="item.title"
              style="display:flex;align-items:center;gap:12px;padding:12px 16px;transition:background .1s;cursor:pointer"
              :style="i % 2 === 0 ? 'background:var(--bg2)' : 'background:var(--bg)'"
              @mouseenter="e => (e.currentTarget as HTMLElement).style.background='var(--bg3)'"
              @mouseleave="e => (e.currentTarget as HTMLElement).style.background=i%2===0?'var(--bg2)':'var(--bg)'">
              <span style="font-size:1.3rem;width:32px;text-align:center;flex-shrink:0">{{ item.icon }}</span>
              <div style="flex:1;min-width:0">
                <div style="font-weight:600;font-size:.9rem">{{ item.title }}</div>
                <div style="font-size:.78rem;color:var(--text2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{ item.desc }}</div>
              </div>
              <span class="badge" :class="item.badge">{{ item.tag }}</span>
              <span style="color:var(--text2);font-size:.8rem">›</span>
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('code-block')" v-show="activeSection === 'code-block'" class="sb-section">
        <h2 class="sb-section-title">Code Block</h2>
        <p class="sb-section-desc">Syntax-highlighted code with copy button and language label.</p>
        <SbStory :code="codeBlockCode">
          <div style="border-radius:10px;overflow:hidden;border:1px solid var(--bg3)">
            <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 16px;background:#0d1929;border-bottom:1px solid var(--bg3)">
              <div style="display:flex;gap:6px">
                <span style="width:12px;height:12px;border-radius:50%;background:#ef4444;display:inline-block" />
                <span style="width:12px;height:12px;border-radius:50%;background:#f59e0b;display:inline-block" />
                <span style="width:12px;height:12px;border-radius:50%;background:#22c55e;display:inline-block" />
              </div>
              <span style="font-size:.72rem;font-family:monospace;color:var(--accent2);font-weight:700">TypeScript</span>
              <button class="btn btn-secondary btn-sm" style="font-size:.72rem;padding:3px 10px" @click="copyCodeBlock">{{ cbCopied ? '✓ Copied' : 'Copy' }}</button>
            </div>
            <pre style="background:#0d1929;padding:18px 20px;margin:0;font-size:.82rem;overflow-x:auto;line-height:1.7"><code><span style="color:#7dd3fc">const</span> <span style="color:#f1f5f9">greet</span> <span style="color:#94a3b8">= </span><span style="color:#fbbf24">(name</span><span style="color:#94a3b8">: </span><span style="color:#4ade80">string</span><span style="color:#fbbf24">)</span><span style="color:#94a3b8">: </span><span style="color:#4ade80">string</span> <span style="color:#94a3b8">=&gt;</span> <span style="color:#f97316">{</span>
  <span style="color:#94a3b8">return</span> <span style="color:#34d399">`Hello, </span><span style="color:#60a5fa">${name}</span><span style="color:#34d399">!`</span>
<span style="color:#f97316">}</span>
<span style="color:#94a3b8">console</span>.<span style="color:#60a5fa">log</span>(<span style="color:#f1f5f9">greet</span>(<span style="color:#34d399">'Vue'</span>))</code></pre>
          </div>
        </SbStory>
      </section>

      <section :id="sid('accordion')" v-show="activeSection === 'accordion'" class="sb-section">
        <h2 class="sb-section-title">Accordion</h2>
        <p class="sb-section-desc">Collapsible sections — single open or multi-open modes.</p>
        <SbStory :code="accordionCode">
          <div style="display:flex;flex-direction:column;gap:4px">
            <div v-for="(item, i) in accordionItems" :key="item.q"
              style="border:1px solid var(--bg3);border-radius:8px;overflow:hidden">
              <button
                style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:14px 16px;background:var(--bg2);border:none;color:var(--text);font-size:.92rem;font-weight:600;cursor:pointer;transition:background .15s;text-align:left"
                @click="accordionOpen = accordionOpen === i ? null : i"
                :style="accordionOpen===i ? 'background:rgba(99,102,241,.12)' : ''">
                <span>{{ item.q }}</span>
                <span style="transition:transform .2s;font-size:.8rem;color:var(--accent2)"
                  :style="accordionOpen===i ? 'transform:rotate(180deg)' : ''">▼</span>
              </button>
              <div v-if="accordionOpen===i"
                style="padding:14px 16px;background:var(--bg);font-size:.88rem;color:var(--text2);line-height:1.7;border-top:1px solid var(--bg3)">
                {{ item.a }}
              </div>
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('banner')" v-show="activeSection === 'banner'" class="sb-section">
        <h2 class="sb-section-title">Banner / Callout</h2>
        <p class="sb-section-desc">Prominent announcement banners and contextual callout boxes.</p>
        <SbStory :code="bannerCode">
          <div style="display:flex;flex-direction:column;gap:10px">
            <div v-for="bn in banners" :key="bn.title"
              style="display:flex;gap:12px;padding:14px 16px;border-radius:10px;align-items:flex-start"
              :style="{ background: bn.bg, borderLeft: '4px solid ' + bn.border }">
              <span style="font-size:1.2rem;flex-shrink:0">{{ bn.icon }}</span>
              <div style="flex:1">
                <div style="font-weight:700;font-size:.9rem;margin-bottom:2px" :style="{ color: bn.border }">{{ bn.title }}</div>
                <div style="font-size:.83rem;color:var(--text2)">{{ bn.desc }}</div>
              </div>
              <button style="background:none;border:none;cursor:pointer;color:var(--text2);font-size:.85rem;padding:0;flex-shrink:0" @click="">✕</button>
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('icon-grid')" v-show="activeSection === 'icon-grid'" class="sb-section">
        <h2 class="sb-section-title">Icon Grid</h2>
        <p class="sb-section-desc">Browsable emoji / unicode icon collection with copy-on-click.</p>
        <SbStory :code="iconGridCode">
          <div v-if="copiedIcon" style="font-size:.8rem;color:var(--green);margin-bottom:8px">✓ Copied "{{ copiedIcon }}"</div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(52px,1fr));gap:6px">
            <button v-for="ic in iconSet" :key="ic.emoji"
              style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 4px;background:var(--bg2);border:1px solid var(--bg3);border-radius:8px;cursor:pointer;transition:all .15s;font-size:1.4rem"
              :title="ic.label"
              @click="copyIcon(ic.emoji)"
              @mouseenter="e=>(e.currentTarget as HTMLElement).style.background='var(--bg3)'"
              @mouseleave="e=>(e.currentTarget as HTMLElement).style.background='var(--bg2)'">
              {{ ic.emoji }}
              <span style="font-size:.6rem;color:var(--text2);text-overflow:ellipsis;overflow:hidden;white-space:nowrap;max-width:100%;display:block">{{ ic.label }}</span>
            </button>
          </div>
        </SbStory>
      </section>

      <section :id="sid('meter')" v-show="activeSection === 'meter'" class="sb-section">
        <h2 class="sb-section-title">Meter / Level</h2>
        <p class="sb-section-desc">Skill bars, storage meters, and segmented level indicators.</p>
        <SbStory :code="meterCode">
          <div style="display:flex;flex-direction:column;gap:14px">
            <div v-for="m in meters" :key="m.label">
              <div style="display:flex;justify-content:space-between;margin-bottom:5px">
                <span style="font-size:.85rem;font-weight:600">{{ m.label }}</span>
                <span style="font-size:.82rem;font-family:monospace" :style="{ color: m.color }">{{ m.value }}%</span>
              </div>
              <div style="height:10px;background:var(--bg3);border-radius:999px;overflow:hidden">
                <div style="height:100%;border-radius:999px;transition:width .6s ease"
                  :style="{ width: m.value + '%', background: m.color }" />
              </div>
            </div>
            <div class="divider" style="margin:4px 0" />
            <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
              <span style="font-size:.82rem;color:var(--text2);margin-right:4px">Signal:</span>
              <div v-for="n in 5" :key="n"
                style="width:10px;border-radius:2px;transition:background .3s"
                :style="{ height: (8 + n * 5) + 'px', background: n <= meterSignal ? 'var(--green)' : 'var(--bg3)' }" />
              <button class="btn btn-secondary btn-sm" @click="meterSignal = meterSignal < 5 ? meterSignal + 1 : 0">Cycle</button>
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('status-ind')" v-show="activeSection === 'status-ind'" class="sb-section">
        <h2 class="sb-section-title">Status Indicators</h2>
        <p class="sb-section-desc">Online presence dots, pulsing activity, and user status badges.</p>
        <SbStory :code="statusIndCode">
          <div style="display:flex;gap:24px;flex-wrap:wrap;align-items:center">
            <div v-for="st in statusUsers" :key="st.name"
              style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--bg2);border-radius:10px;border:1px solid var(--bg3)">
              <div style="position:relative">
                <div style="width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:700"
                  :style="{ background: st.color + '33', color: st.color }">{{ st.initials }}</div>
                <div style="position:absolute;bottom:0;right:0;width:11px;height:11px;border-radius:50%;border:2px solid var(--bg2)"
                  :class="st.status === 'online' ? 'sb-pulse-dot' : ''"
                  :style="{ background: st.statusColor }" />
              </div>
              <div>
                <div style="font-size:.88rem;font-weight:700">{{ st.name }}</div>
                <div style="font-size:.75rem;color:var(--text2)">{{ st.status }}</div>
              </div>
            </div>
          </div>
        </SbStory>
      </section>

      <!-- ════════════════ CHARTS ════════════════ -->

      <section :id="sid('line-chart')" v-show="activeSection === 'line-chart'" class="sb-section">
        <h2 class="sb-section-title">Line Chart</h2>
        <p class="sb-section-desc">Reactive SVG line chart with area fill, grid lines, and hover tooltips.</p>
        <SbStory :code="lineChartCode">
          <div class="row" style="gap:6px;margin-bottom:12px">
            <button v-for="(ds, i) in lineDatasets" :key="ds.label" class="btn btn-sm"
              :class="lineActive===i ? 'btn-primary' : 'btn-secondary'" @click="lineActive=i">{{ ds.label }}</button>
          </div>
          <svg viewBox="0 0 500 195" style="width:100%;display:block;overflow:visible">
            <defs>
              <linearGradient id="lg-line" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" :stop-color="lineDatasets[lineActive].color" stop-opacity="0.3" />
                <stop offset="100%" :stop-color="lineDatasets[lineActive].color" stop-opacity="0.02" />
              </linearGradient>
            </defs>
            <!-- horizontal grid -->
            <line v-for="i in 5" :key="'g'+i" x1="42" :y1="10+(i-1)*33" x2="492" :y2="10+(i-1)*33" stroke="#334155" stroke-width="0.5" />
            <!-- y labels -->
            <text v-for="i in 5" :key="'y'+i" x="38" :y="14+(i-1)*33" text-anchor="end" font-size="9" fill="#64748b">
              {{ Math.round(lineMax * (1-(i-1)/4)) }}
            </text>
            <!-- area fill -->
            <polygon :points="lineArea" :fill="`url(#lg-line)`" />
            <!-- line -->
            <polyline :points="linePolyline" fill="none" :stroke="lineDatasets[lineActive].color" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
            <!-- points + tooltips -->
            <g v-for="(pt, i) in linePoints" :key="i">
              <circle :cx="pt.x" :cy="pt.y" r="12" fill="transparent" style="cursor:pointer"
                @mouseenter="lineHover=i" @mouseleave="lineHover=null" />
              <circle :cx="pt.x" :cy="pt.y" r="4" :fill="lineDatasets[lineActive].color" />
              <g v-if="lineHover===i">
                <rect :x="pt.x-24" :y="pt.y-34" width="48" height="22" rx="4" fill="#1e293b" stroke="#475569" stroke-width="0.5" />
                <text :x="pt.x" :y="pt.y-19" text-anchor="middle" font-size="11" fill="#f1f5f9" font-weight="700">{{ pt.v }}</text>
              </g>
            </g>
            <!-- x labels -->
            <text v-for="(pt, i) in linePoints" :key="'xl'+i" :x="pt.x" y="192" text-anchor="middle" font-size="9" fill="#64748b">{{ pt.label }}</text>
          </svg>
        </SbStory>
      </section>

      <section :id="sid('bar-chart')" v-show="activeSection === 'bar-chart'" class="sb-section">
        <h2 class="sb-section-title">Bar Chart</h2>
        <p class="sb-section-desc">SVG vertical bar chart with value labels and hover highlight.</p>
        <SbStory :code="barChartCode">
          <svg viewBox="0 0 500 200" style="width:100%;display:block">
            <!-- grid -->
            <line v-for="i in 5" :key="'g'+i" x1="40" :y1="10+(i-1)*34" x2="490" :y2="10+(i-1)*34" stroke="#334155" stroke-width="0.5" />
            <!-- y labels -->
            <text v-for="i in 5" :key="'yl'+i" x="36" :y="14+(i-1)*34" text-anchor="end" font-size="9" fill="#64748b">
              {{ Math.round(barMax * (1-(i-1)/4)) }}
            </text>
            <!-- bars -->
            <g v-for="(bar, i) in barBars" :key="i"
              @mouseenter="barHover=i" @mouseleave="barHover=null" style="cursor:pointer">
              <rect :x="bar.x" :y="bar.y" :width="bar.w" :height="bar.h" :rx="4"
                :fill="barHover===i ? bar.hoverColor : bar.color" style="transition:fill 0.15s" />
              <!-- value label on top -->
              <text :x="bar.x + bar.w/2" :y="bar.y - 5" text-anchor="middle" font-size="10" fill="#94a3b8" font-weight="600">{{ bar.v }}</text>
              <!-- x label below -->
              <text :x="bar.x + bar.w/2" y="196" text-anchor="middle" font-size="10" fill="#64748b">{{ bar.label }}</text>
            </g>
          </svg>
        </SbStory>
      </section>

      <section :id="sid('donut-chart')" v-show="activeSection === 'donut-chart'" class="sb-section">
        <h2 class="sb-section-title">Donut Chart</h2>
        <p class="sb-section-desc">SVG donut using <code>stroke-dasharray</code> segments with a legend.</p>
        <SbStory :code="donutChartCode">
          <div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap">
            <svg viewBox="0 0 160 160" style="width:160px;height:160px;flex-shrink:0">
              <g transform="rotate(-90 80 80)">
                <circle v-for="seg in donutSegments" :key="seg.label"
                  cx="80" cy="80" r="60" fill="none" :stroke="seg.color" stroke-width="28"
                  :stroke-dasharray="seg.dasharray" :stroke-dashoffset="seg.offset"
                  style="transition:stroke-dashoffset 0.4s" />
              </g>
              <!-- center label -->
              <text x="80" y="76" text-anchor="middle" font-size="20" font-weight="800" fill="#f1f5f9">{{ donutTotal }}</text>
              <text x="80" y="92" text-anchor="middle" font-size="10" fill="#94a3b8">total</text>
            </svg>
            <div style="display:flex;flex-direction:column;gap:8px">
              <div v-for="seg in donutSegments" :key="seg.label"
                style="display:flex;align-items:center;gap:8px;font-size:0.85rem">
                <div :style="{ width:'12px', height:'12px', borderRadius:'3px', background:seg.color, flexShrink:0 }" />
                <span style="color:var(--text2);min-width:70px">{{ seg.label }}</span>
                <span style="font-weight:700">{{ seg.value }}</span>
                <span style="color:var(--text2)">{{ Math.round(seg.value/donutTotal*100) }}%</span>
              </div>
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('sparkline')" v-show="activeSection === 'sparkline'" class="sb-section">
        <h2 class="sb-section-title">Sparklines</h2>
        <p class="sb-section-desc">Tiny inline trend charts — no axes, minimal footprint.</p>
        <SbStory :code="sparklineCode">
          <div style="display:flex;flex-direction:column;gap:14px">
            <div v-for="spark in sparklines" :key="spark.label"
              style="display:flex;align-items:center;gap:16px;padding:10px 14px;background:var(--bg3);border-radius:8px">
              <div style="min-width:80px">
                <div style="font-weight:700;font-size:0.9rem" :style="{ color: spark.up ? 'var(--green)' : 'var(--red)' }">{{ spark.value }}</div>
                <div style="font-size:0.75rem;color:var(--text2)">{{ spark.label }}</div>
              </div>
              <svg :viewBox="`0 0 100 30`" style="width:100px;height:30px;flex-shrink:0">
                <polyline :points="sparkPoints(spark.data)" fill="none"
                  :stroke="spark.up ? 'var(--green)' : 'var(--red)'" stroke-width="2" stroke-linejoin="round" />
              </svg>
              <span :style="{ color: spark.up ? 'var(--green)' : 'var(--red)', fontSize:'0.82rem', fontWeight:'700', marginLeft:'auto' }">
                {{ spark.up ? '↑' : '↓' }} {{ spark.change }}
              </span>
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('gauge')" v-show="activeSection === 'gauge'" class="sb-section">
        <h2 class="sb-section-title">Gauge</h2>
        <p class="sb-section-desc">Semicircular SVG gauge with gradient fill and label.</p>
        <SbStory :code="gaugeCode">
          <div style="display:flex;gap:24px;flex-wrap:wrap;align-items:flex-end;justify-content:center">
            <div v-for="g in gauges" :key="g.label" style="display:flex;flex-direction:column;align-items:center;gap:4px">
              <svg viewBox="0 0 200 115" style="width:160px;display:block">
                <defs>
                  <linearGradient :id="'gg-'+g.label" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" :stop-color="g.c1" />
                    <stop offset="100%" :stop-color="g.c2" />
                  </linearGradient>
                </defs>
                <!-- track -->
                <path d="M 20,100 A 80,80 0 0,1 180,100" fill="none" stroke="#334155" stroke-width="16" stroke-linecap="round" />
                <!-- fill -->
                <path d="M 20,100 A 80,80 0 0,1 180,100" fill="none"
                  :stroke="`url(#gg-${g.label})`" stroke-width="16" stroke-linecap="round"
                  :stroke-dasharray="`${(g.value/100)*251.33} 251.33`" />
                <text x="100" y="88" text-anchor="middle" font-size="26" font-weight="800" fill="#f1f5f9">{{ g.value }}%</text>
                <text x="100" y="106" text-anchor="middle" font-size="10" fill="#94a3b8">{{ g.label }}</text>
              </svg>
              <input v-model.number="g.value" type="range" min="0" max="100" style="width:140px;accent-color:var(--accent)" />
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('heatmap')" v-show="activeSection === 'heatmap'" class="sb-section">
        <h2 class="sb-section-title">Heatmap</h2>
        <p class="sb-section-desc">GitHub-style contribution heatmap — 52 weeks × 7 days.</p>
        <SbStory :code="heatmapCode">
          <div style="overflow-x:auto">
            <div style="display:flex;gap:4px;margin-bottom:6px;padding-left:18px">
              <div v-for="m in heatMonths" :key="m.label"
                :style="{ width: m.weeks * 14 + 'px', fontSize:'10px', color:'#64748b', flexShrink:0 }">
                {{ m.label }}
              </div>
            </div>
            <div style="display:flex;gap:4px">
              <div style="display:flex;flex-direction:column;gap:2px;flex-shrink:0">
                <div v-for="d in ['','M','','W','','F','']" :key="d" style="height:12px;width:14px;font-size:9px;color:#64748b;line-height:12px">{{ d }}</div>
              </div>
              <div class="sb-heatmap-grid">
                <div v-for="(cell, i) in heatmapData" :key="i"
                  class="sb-heatmap-cell"
                  :style="{ background: heatColor(cell.value) }"
                  :title="`${cell.value} contributions`" />
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:4px;margin-top:8px;font-size:10px;color:#64748b;justify-content:flex-end">
              <span>Less</span>
              <div v-for="v in [0,1,2,3,4]" :key="v" style="width:12px;height:12px;border-radius:2px" :style="{ background: heatColor(v) }" />
              <span>More</span>
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('area-chart')" v-show="activeSection === 'area-chart'" class="sb-section">
        <h2 class="sb-section-title">Area Chart</h2>
        <p class="sb-section-desc">Multi-series stacked area chart with gradient fills.</p>
        <SbStory :code="areaChartCode">
          <svg viewBox="0 0 500 200" style="width:100%;display:block">
            <defs>
              <linearGradient id="area-g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#6366f1" stop-opacity="0.5" />
                <stop offset="100%" stop-color="#6366f1" stop-opacity="0.05" />
              </linearGradient>
              <linearGradient id="area-g2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#22c55e" stop-opacity="0.4" />
                <stop offset="100%" stop-color="#22c55e" stop-opacity="0.03" />
              </linearGradient>
            </defs>
            <line x1="40" y1="10" x2="40" y2="170" stroke="#334155" stroke-width="1" />
            <line x1="40" y1="170" x2="490" y2="170" stroke="#334155" stroke-width="1" />
            <polygon :points="areaPoints1" fill="url(#area-g1)" />
            <polygon :points="areaPoints2" fill="url(#area-g2)" />
            <polyline :points="areaLine1" fill="none" stroke="#6366f1" stroke-width="2" stroke-linejoin="round" />
            <polyline :points="areaLine2" fill="none" stroke="#22c55e" stroke-width="2" stroke-linejoin="round" />
            <text v-for="(l,i) in ['Jan','Mar','May','Jul','Sep','Nov']" :key="l" :x="40+(i*(450/5))" y="188" text-anchor="middle" fill="#64748b" font-size="9">{{ l }}</text>
          </svg>
          <div style="display:flex;gap:16px;margin-top:6px">
            <span style="display:flex;align-items:center;gap:6px;font-size:.8rem"><span style="width:12px;height:3px;background:#6366f1;display:inline-block;border-radius:2px"></span>Revenue</span>
            <span style="display:flex;align-items:center;gap:6px;font-size:.8rem"><span style="width:12px;height:3px;background:#22c55e;display:inline-block;border-radius:2px"></span>Users</span>
          </div>
        </SbStory>
      </section>

      <section :id="sid('hbar-chart')" v-show="activeSection === 'hbar-chart'" class="sb-section">
        <h2 class="sb-section-title">Horizontal Bar Chart</h2>
        <p class="sb-section-desc">Ranked horizontal bars — ideal for comparisons.</p>
        <SbStory :code="hbarChartCode">
          <div style="display:flex;flex-direction:column;gap:8px">
            <div v-for="hb in hbarData" :key="hb.label" style="display:flex;align-items:center;gap:10px">
              <span style="width:80px;font-size:.8rem;color:var(--text2);text-align:right;flex-shrink:0">{{ hb.label }}</span>
              <div style="flex:1;height:22px;background:var(--bg3);border-radius:4px;overflow:hidden">
                <div style="height:100%;border-radius:4px;transition:width .6s ease;display:flex;align-items:center;padding-left:8px"
                  :style="{ width: (hb.v / hbarMax * 100) + '%', background: hb.color }">
                  <span v-if="hb.v / hbarMax > 0.2" style="font-size:.72rem;font-weight:700;color:#fff">{{ hb.v }}</span>
                </div>
              </div>
              <span style="font-size:.8rem;font-family:monospace;color:var(--text2);min-width:28px">{{ hb.v }}</span>
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('pie-chart')" v-show="activeSection === 'pie-chart'" class="sb-section">
        <h2 class="sb-section-title">Pie Chart</h2>
        <p class="sb-section-desc">SVG pie chart with hover highlight and legend.</p>
        <SbStory :code="pieChartCode">
          <div style="display:flex;gap:28px;flex-wrap:wrap;align-items:center">
            <svg viewBox="-1 -1 2 2" style="width:180px;height:180px;flex-shrink:0" @mouseleave="pieHover=null">
              <path v-for="(seg,i) in pieSegments" :key="i"
                :d="seg.d" :fill="seg.color"
                :opacity="pieHover===null||pieHover===i ? 1 : 0.4"
                style="cursor:pointer;transition:opacity .15s"
                @mouseenter="pieHover=i" />
            </svg>
            <div style="display:flex;flex-direction:column;gap:6px">
              <div v-for="(d,i) in pieData" :key="d.label"
                style="display:flex;align-items:center;gap:8px;cursor:pointer;transition:opacity .15s"
                :style="pieHover===null||pieHover===i ? '' : 'opacity:0.4'"
                @mouseenter="pieHover=i" @mouseleave="pieHover=null">
                <span style="width:12px;height:12px;border-radius:3px;flex-shrink:0" :style="{ background: d.color }" />
                <span style="font-size:.85rem">{{ d.label }}</span>
                <span style="font-size:.82rem;font-family:monospace;color:var(--text2);margin-left:auto">{{ d.value }}%</span>
              </div>
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('scatter-chart')" v-show="activeSection === 'scatter-chart'" class="sb-section">
        <h2 class="sb-section-title">Scatter Plot</h2>
        <p class="sb-section-desc">2D scatter with bubble sizing and hover tooltip.</p>
        <SbStory :code="scatterCode">
          <div style="position:relative">
            <svg viewBox="0 0 500 200" style="width:100%;display:block">
              <line x1="40" y1="10" x2="40" y2="170" stroke="#334155" stroke-width="1" />
              <line x1="40" y1="170" x2="490" y2="170" stroke="#334155" stroke-width="1" />
              <line v-for="g in [40,100,145,170]" :key="g" x1="40" :x2="490" :y1="g" :y2="g" stroke="#1e293b" stroke-width="1" stroke-dasharray="3,3" />
              <circle v-for="(pt,i) in scatterPts" :key="i"
                :cx="pt.x" :cy="pt.y"
                :r="scatterHover===i ? pt.r+3 : pt.r"
                :fill="pt.color" fill-opacity="0.7" stroke-width="1" :stroke="pt.color"
                style="cursor:pointer;transition:r .1s"
                @mouseenter="scatterHover=i" @mouseleave="scatterHover=null" />
              <text v-if="scatterHover!==null"
                :x="scatterPts[scatterHover].x + 10" :y="scatterPts[scatterHover].y - 6"
                fill="#f1f5f9" font-size="9">{{ scatterPts[scatterHover].label }}</text>
            </svg>
          </div>
        </SbStory>
      </section>

      <section :id="sid('radar-chart')" v-show="activeSection === 'radar-chart'" class="sb-section">
        <h2 class="sb-section-title">Radar Chart</h2>
        <p class="sb-section-desc">Spider/radar chart for multi-dimensional comparisons.</p>
        <SbStory :code="radarCode">
          <div style="display:flex;justify-content:center">
            <svg viewBox="0 0 260 240" style="width:260px;height:240px">
              <polygon v-for="l in [1,0.75,0.5,0.25]" :key="l"
                :points="radarGrid(l)" fill="none" stroke="#334155" stroke-width="1" />
              <line v-for="(ax,i) in radarAxes" :key="i"
                :x1="130" :y1="120"
                :x2="130 + 100*Math.cos((i/radarAxes.length)*2*Math.PI - Math.PI/2)"
                :y2="120 + 100*Math.sin((i/radarAxes.length)*2*Math.PI - Math.PI/2)"
                stroke="#334155" stroke-width="1" />
              <polygon :points="radarDataPts(radarSeries[0])" fill="#6366f133" stroke="#6366f1" stroke-width="2" />
              <polygon :points="radarDataPts(radarSeries[1])" fill="#22c55e22" stroke="#22c55e" stroke-width="2" />
              <text v-for="(ax,i) in radarAxes" :key="ax"
                :x="130 + 112*Math.cos((i/radarAxes.length)*2*Math.PI - Math.PI/2)"
                :y="120 + 112*Math.sin((i/radarAxes.length)*2*Math.PI - Math.PI/2)"
                text-anchor="middle" dominant-baseline="middle" fill="#94a3b8" font-size="9">{{ ax }}</text>
            </svg>
          </div>
        </SbStory>
      </section>

      <section :id="sid('stacked-bar')" v-show="activeSection === 'stacked-bar'" class="sb-section">
        <h2 class="sb-section-title">Stacked Bar Chart</h2>
        <p class="sb-section-desc">Grouped stacked bars showing proportional composition.</p>
        <SbStory :code="stackedBarCode">
          <svg viewBox="0 0 500 200" style="width:100%;display:block">
            <line x1="40" y1="170" x2="490" y2="170" stroke="#334155" stroke-width="1" />
            <g v-for="(sb2, i) in stackedBars" :key="sb2.label">
              <rect v-for="(seg, si) in sb2.segs" :key="si"
                :x="55 + i*70" :width="44"
                :y="seg.y" :height="seg.h"
                :fill="seg.color" rx="2" />
              <text :x="55 + i*70 + 22" y="186" text-anchor="middle" fill="#64748b" font-size="9">{{ sb2.label }}</text>
            </g>
            <g v-for="(seg,si) in stackedLegend" :key="seg.label" :transform="`translate(${50+si*95},198)`">
              <rect width="10" height="10" :fill="seg.color" rx="2" />
              <text x="14" y="9" fill="#94a3b8" font-size="9">{{ seg.label }}</text>
            </g>
          </svg>
        </SbStory>
      </section>

      <!-- ════════════════ DATA ════════════════ -->

      <section :id="sid('data-table')" v-show="activeSection === 'data-table'" class="sb-section">
        <h2 class="sb-section-title">Data Table</h2>
        <p class="sb-section-desc">Sortable columns, search filter, status badges, and row selection.</p>
        <SbStory :code="dataTableCode">
          <div style="display:flex;gap:8px;margin-bottom:10px;align-items:center">
            <input v-model="tableSearch" class="input" placeholder="Search name, dept…" style="max-width:220px" />
            <span style="font-size:0.82rem;color:var(--text2);margin-left:auto">{{ filteredTable.length }} rows</span>
          </div>
          <div style="overflow-x:auto;border-radius:8px;border:1px solid var(--bg3)">
            <table class="sb-table">
              <thead>
                <tr>
                  <th v-for="col in tableCols" :key="col.key" @click="sortTable(col.key)">
                    {{ col.label }}
                    <span v-if="tableSort.col === col.key" style="margin-left:4px">{{ tableSort.dir === 'asc' ? '↑' : '↓' }}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in filteredTable" :key="row.id"
                  :class="{ 'sb-row-selected': tableSelected === row.id }"
                  @click="tableSelected = tableSelected === row.id ? null : row.id">
                  <td>{{ row.id }}</td>
                  <td style="font-weight:600">{{ row.name }}</td>
                  <td>{{ row.dept }}</td>
                  <td>
                    <span class="badge" :class="{
                      'badge-green':  row.status === 'Active',
                      'badge-yellow': row.status === 'On Leave',
                      'badge-red':    row.status === 'Inactive',
                    }">{{ row.status }}</span>
                  </td>
                  <td style="font-variant-numeric:tabular-nums">
                    <div style="display:flex;align-items:center;gap:8px">
                      <div style="flex:1;height:4px;background:var(--bg3);border-radius:2px;min-width:50px">
                        <div style="height:100%;border-radius:2px;transition:width 0.3s"
                          :style="{ width: row.score+'%', background: row.score>=90 ? 'var(--green)' : row.score>=75 ? 'var(--accent)' : 'var(--red)' }" />
                      </div>
                      <span style="font-size:0.82rem;min-width:28px">{{ row.score }}</span>
                    </div>
                  </td>
                  <td style="color:var(--text2);font-size:0.82rem">{{ row.date }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SbStory>
      </section>

      <section :id="sid('data-grid')" v-show="activeSection === 'data-grid'" class="sb-section">
        <h2 class="sb-section-title">Spreadsheet Grid</h2>
        <p class="sb-section-desc">Editable spreadsheet — click any cell to edit, <kbd>Enter</kbd>/<kbd>Tab</kbd>/<kbd>Esc</kbd> to confirm or cancel.</p>
        <SbStory :code="dataGridCode">
          <!-- formula bar -->
          <div style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:var(--bg3);border-radius:6px;margin-bottom:4px;font-size:0.82rem">
            <span style="color:var(--accent2);font-weight:700;min-width:32px">
              {{ gridSelected ? String.fromCharCode(65 + gridSelected[1]) + (gridSelected[0]) : '—' }}
            </span>
            <span style="color:var(--text2);">fx</span>
            <span style="font-family:monospace;color:var(--text)">
              {{ gridSelected ? gridData[gridSelected[0]][gridSelected[1]] : '' }}
            </span>
          </div>
          <!-- grid -->
          <div style="overflow-x:auto">
            <table class="sb-grid">
              <thead>
                <tr>
                  <th style="width:32px;background:#0f172a" />
                  <th v-for="(_, ci) in gridData[0]" :key="ci">{{ String.fromCharCode(65 + ci) }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, ri) in gridData" :key="ri">
                  <td class="sb-grid-rownum">{{ ri + 1 }}</td>
                  <td v-for="(cell, ci) in row" :key="ci"
                    :class="{ 'sb-grid-td-selected': gridSelected?.[0]===ri && gridSelected?.[1]===ci }">
                    <input v-if="gridEditing?.[0]===ri && gridEditing?.[1]===ci"
                      class="sb-grid-input" v-model="gridEditVal" ref="gridInputRef"
                      @keydown.enter="commitGrid" @keydown.tab.prevent="commitGrid"
                      @keydown.esc="gridEditing=null" @blur="commitGrid" />
                    <div v-else class="sb-grid-cell"
                      :class="{ 'sb-grid-header-cell': ri === 0 }"
                      @click="selectCell(ri, ci)"
                      @dblclick="startEdit(ri, ci)">{{ cell }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style="font-size:0.75rem;color:var(--text2);margin-top:6px">Click to select · Double-click to edit</div>
        </SbStory>
      </section>

      <section :id="sid('pagination')" v-show="activeSection === 'pagination'" class="sb-section">
        <h2 class="sb-section-title">Pagination</h2>
        <p class="sb-section-desc">Page navigation with first/prev/numbered/next/last controls.</p>
        <SbStory :code="paginationCode">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:12px">
            <div style="font-size:0.85rem;color:var(--text2)">
              Showing <strong style="color:var(--text)">{{ pageFrom }}–{{ pageTo }}</strong> of <strong style="color:var(--text)">{{ pageTotal }}</strong>
            </div>
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:0.82rem;color:var(--text2)">Per page:</span>
              <select v-model.number="pageSize" class="input" style="width:70px;padding:5px 8px;font-size:0.82rem"
                @change="pageCurrent = 1">
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="25">25</option>
              </select>
            </div>
          </div>
          <div class="sb-pagination">
            <button class="sb-page-btn" :disabled="pageCurrent===1" @click="pageCurrent=1">«</button>
            <button class="sb-page-btn" :disabled="pageCurrent===1" @click="pageCurrent--">‹</button>
            <button v-for="p in pageRange" :key="p"
              class="sb-page-btn" :class="{ active: p === pageCurrent }"
              @click="typeof p === 'number' && (pageCurrent = p)">{{ p }}</button>
            <button class="sb-page-btn" :disabled="pageCurrent===pageCount" @click="pageCurrent++">›</button>
            <button class="sb-page-btn" :disabled="pageCurrent===pageCount" @click="pageCurrent=pageCount">»</button>
          </div>
        </SbStory>
      </section>

      <section :id="sid('tree-view')" v-show="activeSection === 'tree-view'" class="sb-section">
        <h2 class="sb-section-title">Tree View</h2>
        <p class="sb-section-desc">Expandable/collapsible nested tree with folder icons.</p>
        <SbStory :code="treeViewCode">
          <div style="font-family:monospace;font-size:.85rem">
            <div v-for="node in treeNodes" :key="node.id">
              <TreeNode :node="node" :depth="0" />
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('filter-bar')" v-show="activeSection === 'filter-bar'" class="sb-section">
        <h2 class="sb-section-title">Filter Bar</h2>
        <p class="sb-section-desc">Multi-filter bar with active chip removal and live result count.</p>
        <SbStory :code="filterBarCode">
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:12px">
            <button v-for="f in filterOptions" :key="f"
              class="btn btn-sm" :class="activeFilters.includes(f) ? 'btn-primary' : 'btn-secondary'"
              @click="activeFilters.includes(f) ? activeFilters.splice(activeFilters.indexOf(f),1) : activeFilters.push(f)">
              {{ f }}
            </button>
            <button v-if="activeFilters.length" class="btn btn-sm btn-secondary" @click="activeFilters=[]">Clear all</button>
          </div>
          <div v-if="activeFilters.length" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
            <span v-for="f in activeFilters" :key="f"
              style="display:inline-flex;align-items:center;gap:5px;padding:3px 10px;background:rgba(99,102,241,.18);border:1px solid var(--accent);border-radius:999px;font-size:.78rem;color:var(--accent2)">
              {{ f }}
              <button style="background:none;border:none;cursor:pointer;color:var(--accent2);padding:0;line-height:1;font-size:.85rem" @click="activeFilters.splice(activeFilters.indexOf(f),1)">✕</button>
            </span>
          </div>
          <div style="font-size:.85rem;color:var(--text2)">
            Showing <strong style="color:var(--text)">{{ filterResults.length }}</strong> of {{ filterAllItems.length }} items
            <span v-if="activeFilters.length"> matching <strong style="color:var(--accent2)">{{ activeFilters.join(', ') }}</strong></span>
          </div>
          <div style="display:flex;flex-direction:column;gap:4px;margin-top:10px">
            <div v-for="item in filterResults.slice(0,5)" :key="item.name"
              style="padding:8px 12px;background:var(--bg2);border-radius:6px;border:1px solid var(--bg3);display:flex;justify-content:space-between;align-items:center">
              <span style="font-size:.88rem">{{ item.name }}</span>
              <span class="badge" :class="item.badge" style="font-size:.72rem">{{ item.type }}</span>
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('csv-export')" v-show="activeSection === 'csv-export'" class="sb-section">
        <h2 class="sb-section-title">CSV Export</h2>
        <p class="sb-section-desc">One-click export of table data to a downloadable CSV file.</p>
        <SbStory :code="csvExportCode">
          <div style="margin-bottom:10px;display:flex;gap:8px;align-items:center">
            <button class="btn btn-success btn-sm" @click="exportCsv">⬇ Export CSV</button>
            <span v-if="csvExported" style="font-size:.82rem;color:var(--green);animation:fadein .3s">✓ Downloaded!</span>
          </div>
          <div style="overflow-x:auto">
            <table class="sb-table">
              <thead><tr><th v-for="h in csvHeaders" :key="h">{{ h }}</th></tr></thead>
              <tbody><tr v-for="row in csvRows" :key="row.id"><td v-for="h in csvHeaders" :key="h">{{ (row as any)[h.toLowerCase()] }}</td></tr></tbody>
            </table>
          </div>
        </SbStory>
      </section>

      <section :id="sid('inline-edit')" v-show="activeSection === 'inline-edit'" class="sb-section">
        <h2 class="sb-section-title">Inline Edit</h2>
        <p class="sb-section-desc">Click any cell to edit inline — press Enter to confirm, Escape to cancel.</p>
        <SbStory :code="inlineEditCode">
          <div style="overflow-x:auto">
            <table class="sb-table">
              <thead><tr><th>#</th><th>Name</th><th>Role</th><th>Score</th></tr></thead>
              <tbody>
                <tr v-for="row in inlineRows" :key="row.id">
                  <td style="color:var(--text2);font-family:monospace">{{ row.id }}</td>
                  <td v-for="col in ['name','role','score']" :key="col" @click="startInlineEdit(row.id, col)"
                    style="cursor:pointer;position:relative"
                    @mouseenter="e=>(e.currentTarget as HTMLElement).style.background='rgba(99,102,241,.07)'"
                    @mouseleave="e=>(e.currentTarget as HTMLElement).style.background=''">
                    <template v-if="inlineEditing?.id===row.id && inlineEditing?.col===col">
                      <input :value="(row as any)[col]" class="sb-grid-input" style="width:100%;min-width:80px"
                        @keyup.enter="e=>commitInline(row.id, col, (e.target as HTMLInputElement).value)"
                        @keyup.escape="inlineEditing=null"
                        @blur="e=>commitInline(row.id, col, (e.target as HTMLInputElement).value)"
                        v-focus />
                    </template>
                    <template v-else>
                      <span>{{ (row as any)[col] }}</span>
                      <span style="opacity:0;font-size:.7rem;margin-left:4px;color:var(--accent2)" class="sb-edit-hint">✏</span>
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style="font-size:.78rem;color:var(--text2);margin-top:8px">💡 Click any cell to edit. Press Enter or click away to save.</p>
        </SbStory>
      </section>

      <!-- ════════════════ NAVIGATION ════════════════ -->

      <section :id="sid('breadcrumb')" v-show="activeSection === 'breadcrumb'" class="sb-section">
        <h2 class="sb-section-title">Breadcrumb</h2>
        <p class="sb-section-desc">Hierarchical path navigation with clickable segments.</p>
        <SbStory :code="breadcrumbCode">
          <nav class="sb-breadcrumb">
            <span v-for="(crumb, i) in breadcrumbs" :key="crumb"
              class="sb-crumb-item">
              <button class="sb-crumb-btn"
                :class="{ active: i === breadcrumbs.length - 1 }"
                @click="breadcrumbs = breadcrumbs.slice(0, i + 1)">{{ crumb }}</button>
              <span v-if="i < breadcrumbs.length - 1" class="sb-crumb-sep">/</span>
            </span>
          </nav>
          <div class="row" style="gap:6px;margin-top:12px;flex-wrap:wrap">
            <button v-for="seg in breadcrumbExtend" :key="seg" class="btn btn-sm btn-secondary"
              @click="breadcrumbs = [...breadcrumbs, seg]" :disabled="breadcrumbs.includes(seg)">+ {{ seg }}</button>
          </div>
        </SbStory>
      </section>

      <section :id="sid('stepper')" v-show="activeSection === 'stepper'" class="sb-section">
        <h2 class="sb-section-title">Stepper</h2>
        <p class="sb-section-desc">Horizontal multi-step indicator with completed/active/pending states.</p>
        <SbStory :code="stepperCode">
          <div class="sb-stepper">
            <template v-for="(step, i) in stepperSteps" :key="step">
              <div class="sb-step" :class="{ done: i < stepperCurrent, active: i === stepperCurrent }"
                @click="stepperCurrent = i">
                <div class="sb-step-circle">{{ i < stepperCurrent ? '✓' : i + 1 }}</div>
                <div class="sb-step-label">{{ step }}</div>
              </div>
              <div v-if="i < stepperSteps.length - 1" class="sb-step-line"
                :class="{ done: i < stepperCurrent }" />
            </template>
          </div>
          <div style="display:flex;gap:8px;margin-top:16px">
            <button class="btn btn-secondary btn-sm" :disabled="stepperCurrent===0" @click="stepperCurrent--">← Back</button>
            <button class="btn btn-primary btn-sm" :disabled="stepperCurrent===stepperSteps.length-1" @click="stepperCurrent++">Next →</button>
          </div>
        </SbStory>
      </section>

      <section :id="sid('dropdown')" v-show="activeSection === 'dropdown'" class="sb-section">
        <h2 class="sb-section-title">Dropdown Menu</h2>
        <p class="sb-section-desc">Contextual action menu — click to open, click-outside to close.</p>
        <h3 class="sb-sub">Action Menu</h3>
        <SbStory :code="dropdownCode" row>
          <div v-for="(dd, di) in dropdowns" :key="dd.label" style="position:relative">
            <button class="btn btn-secondary" :class="{ 'btn-primary': dropOpen===di }"
              data-dropdown @click.stop="dropOpen = dropOpen===di ? null : di">
              {{ dd.label }} <span style="font-size:.7rem;margin-left:4px;opacity:.7">▼</span>
            </button>
            <transition name="sb-tip-fade">
              <div v-if="dropOpen===di" class="sb-dropdown">
                <template v-for="item in dd.items" :key="item.label">
                  <div v-if="item.divider" class="sb-dropdown-divider" />
                  <button v-else class="sb-dropdown-item" :class="item.danger ? 'danger' : ''"
                    @click="dropOpen=null">
                    <span>{{ item.icon }}</span>
                    <span>{{ item.label }}</span>
                    <span v-if="item.shortcut" class="sb-dropdown-kbd">{{ item.shortcut }}</span>
                  </button>
                </template>
              </div>
            </transition>
          </div>
        </SbStory>
        <h3 class="sb-sub">Select / Picker</h3>
        <SbStory :code="dropdownSelectCode">
          <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
            <div style="position:relative">
              <button class="btn btn-secondary" style="min-width:180px;justify-content:space-between;display:flex;align-items:center"
                data-dropdown @click.stop="dropSelect = !dropSelect">
                <span>{{ dropSelected || 'Select framework…' }}</span>
                <span style="font-size:.7rem;opacity:.6">▼</span>
              </button>
              <transition name="sb-tip-fade">
                <div v-if="dropSelect" class="sb-dropdown" style="width:100%">
                  <button v-for="opt in dropOptions" :key="opt" class="sb-dropdown-item"
                    :class="{ 'active': dropSelected===opt }"
                    @click="dropSelected=opt; dropSelect=false">
                    <span>{{ dropSelected===opt ? '✓' : '  ' }}</span>
                    <span>{{ opt }}</span>
                  </button>
                </div>
              </transition>
            </div>
            <span v-if="dropSelected" style="font-size:.85rem;color:var(--text2)">Selected: <strong style="color:var(--text)">{{ dropSelected }}</strong></span>
          </div>
        </SbStory>
      </section>

      <section :id="sid('vertical-tabs')" v-show="activeSection === 'vertical-tabs'" class="sb-section">
        <h2 class="sb-section-title">Vertical Tabs</h2>
        <p class="sb-section-desc">Sidebar-style vertical tab navigation.</p>
        <SbStory :code="vertTabsCode">
          <div style="display:flex;gap:0;border:1px solid var(--bg3);border-radius:10px;overflow:hidden;min-height:160px">
            <div style="display:flex;flex-direction:column;border-right:1px solid var(--bg3);min-width:140px;background:var(--bg2)">
              <button v-for="vt in vertTabList" :key="vt"
                style="padding:12px 16px;background:none;border:none;color:var(--text2);font-size:.88rem;cursor:pointer;text-align:left;border-left:3px solid transparent;transition:all .15s"
                :style="vertTabActive===vt ? 'color:var(--accent2);background:rgba(99,102,241,.12);border-left-color:var(--accent)' : ''"
                @click="vertTabActive=vt">{{ vt }}</button>
            </div>
            <div style="flex:1;padding:20px;background:var(--bg)">
              <h3 style="font-size:.95rem;font-weight:700;margin-bottom:8px">{{ vertTabActive }}</h3>
              <p style="font-size:.85rem;color:var(--text2)">Content for the <strong>{{ vertTabActive }}</strong> section goes here.</p>
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('underline-tabs')" v-show="activeSection === 'underline-tabs'" class="sb-section">
        <h2 class="sb-section-title">Underline Tabs</h2>
        <p class="sb-section-desc">Clean underline-style tab bar — no background fill.</p>
        <SbStory :code="underlineTabsCode">
          <div style="border-bottom:2px solid var(--bg3);display:flex;gap:0">
            <button v-for="ut in underlineTabList" :key="ut"
              style="padding:10px 20px;background:none;border:none;font-size:.9rem;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;transition:all .15s;font-weight:600"
              :style="underlineTabActive===ut ? 'color:var(--accent2);border-bottom-color:var(--accent)' : 'color:var(--text2)'"
              @click="underlineTabActive=ut">{{ ut }}</button>
          </div>
          <div style="padding:16px 4px;font-size:.88rem;color:var(--text2)">
            Showing <strong style="color:var(--text)">{{ underlineTabActive }}</strong> tab content
          </div>
        </SbStory>
      </section>

      <section :id="sid('command-palette')" v-show="activeSection === 'command-palette'" class="sb-section">
        <h2 class="sb-section-title">Command Palette</h2>
        <p class="sb-section-desc">⌘K-style searchable command launcher with keyboard shortcuts.</p>
        <SbStory :code="cmdPaletteCode">
          <button class="btn btn-secondary" @click="cmdOpen=true">
            Open Palette <kbd style="margin-left:8px;font-size:.72rem">⌘K</kbd>
          </button>
        </SbStory>
        <Teleport to="body">
          <div v-if="cmdOpen"
            style="position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9000;display:flex;align-items:flex-start;justify-content:center;padding-top:15vh"
            @click.self="cmdOpen=false">
            <div style="width:560px;max-width:92vw;background:var(--bg2);border:1px solid var(--bg3);border-radius:14px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.6)">
              <div style="display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid var(--bg3)">
                <span style="color:var(--text2)">🔍</span>
                <input v-model="cmdQuery" class="sb-search-input" style="flex:1;background:none;border:none;font-size:.95rem;padding:0;outline:none" placeholder="Search commands, pages, docs…" @keyup.escape="cmdOpen=false" v-autofocus />
                <kbd style="font-size:.72rem;color:var(--text2)">Esc</kbd>
              </div>
              <div style="max-height:300px;overflow-y:auto">
                <div v-for="(group, gi) in cmdFiltered" :key="gi">
                  <div style="padding:8px 16px 4px;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text2)">{{ group.label }}</div>
                  <button v-for="cmd in group.items" :key="cmd.label"
                    style="width:100%;display:flex;align-items:center;gap:12px;padding:10px 16px;background:none;border:none;color:var(--text);font-size:.88rem;cursor:pointer;text-align:left;transition:background .1s"
                    @mouseenter="e=>(e.currentTarget as HTMLElement).style.background='rgba(99,102,241,.12)'"
                    @mouseleave="e=>(e.currentTarget as HTMLElement).style.background=''"
                    @click="cmdOpen=false">
                    <span style="font-size:1.1rem">{{ cmd.icon }}</span>
                    <span style="flex:1">{{ cmd.label }}</span>
                    <span v-if="cmd.shortcut" style="font-size:.72rem;color:var(--text2);font-family:monospace">{{ cmd.shortcut }}</span>
                  </button>
                </div>
                <div v-if="cmdFiltered.length===0" style="padding:24px;text-align:center;color:var(--text2);font-size:.88rem">No results for "{{ cmdQuery }}"</div>
              </div>
            </div>
          </div>
        </Teleport>
      </section>

      <section :id="sid('context-menu')" v-show="activeSection === 'context-menu'" class="sb-section">
        <h2 class="sb-section-title">Context Menu</h2>
        <p class="sb-section-desc">Right-click context menu with nested items.</p>
        <SbStory :code="contextMenuCode">
          <div style="padding:32px;background:var(--bg2);border-radius:10px;border:2px dashed var(--bg3);text-align:center;cursor:context-menu;user-select:none"
            @contextmenu.prevent="openContextMenu">
            <p style="color:var(--text2);font-size:.88rem">Right-click anywhere in this area</p>
          </div>
        </SbStory>
        <Teleport to="body">
          <div v-if="ctxOpen"
            style="position:fixed;z-index:8000"
            :style="{ top: ctxY + 'px', left: ctxX + 'px' }">
            <div class="sb-dropdown" style="position:static;min-width:180px">
              <button v-for="item in ctxItems" :key="item.label" class="sb-dropdown-item"
                :class="item.danger ? 'danger' : ''" @click="ctxOpen=false">
                <span>{{ item.icon }}</span><span>{{ item.label }}</span>
              </button>
            </div>
          </div>
        </Teleport>
      </section>

      <section :id="sid('nav-links')" v-show="activeSection === 'nav-links'" class="sb-section">
        <h2 class="sb-section-title">Link Variants</h2>
        <p class="sb-section-desc">Anchor styles — default, muted, accent, destructive, and icon links.</p>
        <SbStory :code="navLinksCode">
          <div style="display:flex;flex-direction:column;gap:10px">
            <div><a href="#" @click.prevent style="color:var(--accent2);text-decoration:none;transition:opacity .15s" @mouseenter="e=>(e.target as HTMLElement).style.opacity='.7'" @mouseleave="e=>(e.target as HTMLElement).style.opacity='1'">Default accent link</a></div>
            <div><a href="#" @click.prevent style="color:var(--text2);text-decoration:none;font-size:.88rem" @mouseenter="e=>(e.target as HTMLElement).style.color='var(--text)'" @mouseleave="e=>(e.target as HTMLElement).style.color='var(--text2)'">Muted secondary link</a></div>
            <div><a href="#" @click.prevent style="color:var(--text);text-decoration:underline;text-underline-offset:3px">Underline link</a></div>
            <div><a href="#" @click.prevent style="color:var(--red);text-decoration:none;font-weight:600" @mouseenter="e=>(e.target as HTMLElement).style.textDecoration='underline'" @mouseleave="e=>(e.target as HTMLElement).style.textDecoration='none'">Destructive link</a></div>
            <div style="display:flex;gap:16px;align-items:center">
              <a href="#" @click.prevent style="display:inline-flex;align-items:center;gap:6px;color:var(--accent2);text-decoration:none;font-size:.88rem">🔗 Link with icon</a>
              <a href="#" @click.prevent style="display:inline-flex;align-items:center;gap:6px;color:var(--accent2);text-decoration:none;font-size:.88rem">GitHub ↗</a>
            </div>
          </div>
        </SbStory>
      </section>

      <!-- ════════════════ FEEDBACK ════════════════ -->

      <section :id="sid('toast')" v-show="activeSection === 'toast'" class="sb-section">
        <h2 class="sb-section-title">Toast / Notifications</h2>
        <p class="sb-section-desc">Auto-dismissing stack notifications — teleported to the bottom-right corner.</p>
        <h3 class="sb-sub">Variants (preview)</h3>
        <SbStory :code="toastPreviewCode">
          <div style="display:flex;flex-direction:column;gap:8px">
            <div v-for="tv in toastVariants" :key="tv.type"
              class="sb-toast" :class="`sb-toast-${tv.type}`"
              style="position:static;pointer-events:none;box-shadow:none;animation:none">
              <span>{{ tv.icon }} {{ tv.msg }}</span>
              <span style="opacity:0.45;font-size:.85rem;line-height:1">✕</span>
            </div>
          </div>
        </SbStory>
        <h3 class="sb-sub">Live (auto-dismiss in 3.5s)</h3>
        <SbStory :code="toastCode" row>
          <button class="btn btn-success btn-sm" @click="addToast('success','File saved successfully!')">Success</button>
          <button class="btn btn-danger btn-sm" @click="addToast('error','Upload failed. Please retry.')">Error</button>
          <button class="btn btn-secondary btn-sm" @click="addToast('info','New version available.')">Info</button>
          <button class="btn btn-warn btn-sm" @click="addToast('warn','Low disk space warning.')">Warning</button>
        </SbStory>
        <Teleport to="body">
          <div style="position:fixed;bottom:24px;right:24px;display:flex;flex-direction:column;gap:8px;z-index:2000;pointer-events:none">
            <div v-for="t in toasts" :key="t.id" class="sb-toast" :class="`sb-toast-${t.type}`" style="pointer-events:auto">
              <span>{{ t.message }}</span>
              <button @click="removeToast(t.id)" style="background:none;border:none;cursor:pointer;color:inherit;opacity:0.7;padding:0 0 0 8px;font-size:1rem;line-height:1">✕</button>
            </div>
          </div>
        </Teleport>
      </section>

      <section :id="sid('popover')" v-show="activeSection === 'popover'" class="sb-section">
        <h2 class="sb-section-title">Popover</h2>
        <p class="sb-section-desc">Rich content popup with arrow — click to toggle.</p>
        <SbStory :code="popoverCode" row>
          <div v-for="(pop, pi) in popovers" :key="pop.label" style="position:relative;display:inline-block">
            <button class="btn btn-secondary" @click="popOpen=popOpen===pi?null:pi">{{ pop.label }}</button>
            <div v-if="popOpen===pi" class="sb-popover" :style="pop.pos==='right' ? 'left:calc(100%+10px);top:0;' : 'bottom:calc(100%+10px);left:50%;transform:translateX(-50%)'">
              <div style="font-weight:700;margin-bottom:4px;font-size:.9rem">{{ pop.title }}</div>
              <p style="font-size:.82rem;color:var(--text2);margin:0">{{ pop.body }}</p>
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('drawer')" v-show="activeSection === 'drawer'" class="sb-section">
        <h2 class="sb-section-title">Drawer</h2>
        <p class="sb-section-desc">Slide-in side panel — left, right variants.</p>
        <SbStory :code="drawerCode" row>
          <button class="btn btn-primary" @click="drawerOpen='right'">Open Right Drawer</button>
          <button class="btn btn-secondary" @click="drawerOpen='left'">Open Left Drawer</button>
        </SbStory>
        <Teleport to="body">
          <div v-if="drawerOpen"
            style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:7000"
            @click.self="drawerOpen=null">
            <div style="position:absolute;top:0;bottom:0;width:320px;max-width:90vw;background:var(--bg2);border:1px solid var(--bg3);display:flex;flex-direction:column"
              :style="drawerOpen==='right' ? 'right:0;border-left:1px solid var(--bg3);border-right:none' : 'left:0;border-right:1px solid var(--bg3);border-left:none'">
              <div style="display:flex;justify-content:space-between;align-items:center;padding:20px;border-bottom:1px solid var(--bg3)">
                <h3 style="font-size:1rem;font-weight:700">Drawer Panel</h3>
                <button @click="drawerOpen=null" style="background:none;border:none;cursor:pointer;color:var(--text2);font-size:1.2rem;line-height:1">✕</button>
              </div>
              <div style="flex:1;padding:20px;overflow-y:auto">
                <p style="color:var(--text2);font-size:.88rem;line-height:1.7">This is a slide-in drawer panel. It can contain forms, navigation, or any content. Click outside or the ✕ to close.</p>
                <div style="margin-top:16px;display:flex;flex-direction:column;gap:8px">
                  <button class="btn btn-primary btn-sm">Action 1</button>
                  <button class="btn btn-secondary btn-sm">Action 2</button>
                </div>
              </div>
            </div>
          </div>
        </Teleport>
      </section>

      <section :id="sid('confirm-dialog')" v-show="activeSection === 'confirm-dialog'" class="sb-section">
        <h2 class="sb-section-title">Confirm Dialog</h2>
        <p class="sb-section-desc">Blocking confirmation prompt before irreversible actions.</p>
        <SbStory :code="confirmDialogCode" row>
          <button class="btn btn-danger" @click="confirmOpen=true">Delete Account</button>
          <span v-if="confirmResult" style="font-size:.85rem;padding:6px 12px;border-radius:6px"
            :style="confirmResult==='confirmed' ? 'background:rgba(239,68,68,.15);color:var(--red)' : 'background:var(--bg3);color:var(--text2)'">
            {{ confirmResult === 'confirmed' ? '✓ Confirmed — account deleted' : '✗ Cancelled' }}
          </span>
        </SbStory>
        <Teleport to="body">
          <div v-if="confirmOpen"
            style="position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:6000;display:flex;align-items:center;justify-content:center;padding:16px">
            <div style="background:var(--bg2);border:1px solid var(--bg3);border-radius:14px;padding:28px;max-width:380px;width:100%;box-shadow:0 24px 60px rgba(0,0,0,.5)">
              <div style="font-size:2rem;margin-bottom:12px">⚠️</div>
              <h3 style="font-weight:800;margin-bottom:8px">Delete account?</h3>
              <p style="color:var(--text2);font-size:.88rem;line-height:1.6;margin-bottom:20px">This will permanently delete your account and all data. This action <strong>cannot be undone</strong>.</p>
              <div style="display:flex;gap:10px;justify-content:flex-end">
                <button class="btn btn-secondary" @click="confirmOpen=false;confirmResult='cancelled'">Cancel</button>
                <button class="btn btn-danger" @click="confirmOpen=false;confirmResult='confirmed'">Delete Account</button>
              </div>
            </div>
          </div>
        </Teleport>
      </section>

      <section :id="sid('loading-states')" v-show="activeSection === 'loading-states'" class="sb-section">
        <h2 class="sb-section-title">Loading States</h2>
        <p class="sb-section-desc">Button loading, inline spinner, full-page overlay, and skeleton variants.</p>
        <SbStory :code="loadingStatesCode">
          <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:16px">
            <button class="btn btn-primary" :disabled="loadingBtn" @click="triggerLoadBtn" style="display:flex;align-items:center;gap:8px;min-width:130px;justify-content:center">
              <span v-if="loadingBtn" class="sb-spinner" style="width:14px;height:14px;border-width:2px;border-color:rgba(255,255,255,.3);border-top-color:#fff" />
              <span>{{ loadingBtn ? 'Processing…' : 'Trigger Load' }}</span>
            </button>
            <div style="display:flex;align-items:center;gap:8px;font-size:.88rem;color:var(--text2)">
              <span class="sb-spinner" style="width:16px;height:16px;border-width:2px;border-color:var(--bg3);border-top-color:var(--accent)" />
              Syncing data…
            </div>
          </div>
          <div style="display:flex;gap:3px">
            <div v-for="n in 3" :key="n" style="flex:1;height:8px;border-radius:999px;background:var(--bg3);overflow:hidden">
              <div style="height:100%;border-radius:999px;background:var(--accent);animation:sb-loading-bar 1.4s ease infinite"
                :style="{ animationDelay: (n-1)*0.2 + 's' }" />
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('notif-bell')" v-show="activeSection === 'notif-bell'" class="sb-section">
        <h2 class="sb-section-title">Notification Bell</h2>
        <p class="sb-section-desc">Bell icon with unread badge and dropdown notification panel.</p>
        <SbStory :code="notifBellCode">
          <div style="position:relative;display:inline-block">
            <button style="position:relative;background:var(--bg2);border:1px solid var(--bg3);border-radius:8px;padding:8px 10px;cursor:pointer;font-size:1.1rem;transition:background .15s"
              @click="notifOpen=!notifOpen"
              @mouseenter="e=>(e.currentTarget as HTMLElement).style.background='var(--bg3)'"
              @mouseleave="e=>(e.currentTarget as HTMLElement).style.background='var(--bg2)'">
              🔔
              <span v-if="notifUnread>0" style="position:absolute;top:-5px;right:-5px;background:var(--red);color:#fff;border-radius:999px;font-size:.65rem;font-weight:700;padding:1px 5px;min-width:18px;text-align:center;border:2px solid var(--bg)">{{ notifUnread }}</span>
            </button>
            <div v-if="notifOpen" style="position:absolute;top:calc(100%+8px);right:0;width:300px;background:var(--bg2);border:1px solid var(--bg3);border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.4);z-index:200;overflow:hidden">
              <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 14px;border-bottom:1px solid var(--bg3)">
                <span style="font-weight:700;font-size:.9rem">Notifications</span>
                <button @click="notifItems.forEach(n=>n.read=true);notifOpen=false" style="font-size:.75rem;color:var(--accent2);background:none;border:none;cursor:pointer">Mark all read</button>
              </div>
              <div style="max-height:240px;overflow-y:auto">
                <div v-for="n in notifItems" :key="n.id"
                  style="display:flex;gap:10px;padding:12px 14px;border-bottom:1px solid var(--bg3);cursor:pointer;transition:background .1s"
                  :style="n.read ? '' : 'background:rgba(99,102,241,.08)'"
                  @click="n.read=true">
                  <span style="font-size:1.2rem;flex-shrink:0">{{ n.icon }}</span>
                  <div style="flex:1;min-width:0">
                    <div style="font-size:.85rem;font-weight:600">{{ n.title }}</div>
                    <div style="font-size:.78rem;color:var(--text2)">{{ n.time }}</div>
                  </div>
                  <div v-if="!n.read" style="width:8px;height:8px;background:var(--accent);border-radius:50%;flex-shrink:0;margin-top:4px" />
                </div>
              </div>
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('progress-steps')" v-show="activeSection === 'progress-steps'" class="sb-section">
        <h2 class="sb-section-title">Progress Steps</h2>
        <p class="sb-section-desc">Vertical step-by-step checklist with completion tracking.</p>
        <SbStory :code="progressStepsCode">
          <div style="display:flex;flex-direction:column;gap:0">
            <div v-for="(step, i) in progressStepsList" :key="step.title"
              style="display:flex;gap:14px">
              <div style="display:flex;flex-direction:column;align-items:center">
                <button style="width:32px;height:32px;border-radius:50%;border:2px solid;display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:700;cursor:pointer;flex-shrink:0;transition:all .2s"
                  :style="step.done ? 'background:var(--green);border-color:var(--green);color:#fff' : i===progressStepsList.findIndex(s=>!s.done) ? 'border-color:var(--accent);color:var(--accent)' : 'border-color:var(--bg3);color:var(--text2)'"
                  @click="step.done=!step.done">{{ step.done ? '✓' : i+1 }}</button>
                <div v-if="i < progressStepsList.length-1" style="width:2px;flex:1;min-height:20px;background:var(--bg3);margin:4px 0"
                  :style="step.done ? 'background:var(--green)' : ''" />
              </div>
              <div style="padding-bottom:16px;padding-top:4px">
                <div style="font-weight:700;font-size:.9rem" :style="step.done ? 'color:var(--text2);text-decoration:line-through' : ''">{{ step.title }}</div>
                <div style="font-size:.78rem;color:var(--text2);margin-top:2px">{{ step.desc }}</div>
              </div>
            </div>
          </div>
        </SbStory>
      </section>

      <!-- ════════════════ PATTERNS ════════════════ -->

      <section :id="sid('timeline')" v-show="activeSection === 'timeline'" class="sb-section">
        <h2 class="sb-section-title">Timeline</h2>
        <p class="sb-section-desc">Vertical event timeline with icons, dates, and status indicators.</p>
        <SbStory :code="timelineCode">
          <div class="sb-timeline">
            <div v-for="(ev, i) in timelineEvents" :key="ev.title" class="sb-timeline-item">
              <div class="sb-timeline-connector">
                <div class="sb-timeline-icon" :style="{ background: ev.color }">{{ ev.icon }}</div>
                <div v-if="i < timelineEvents.length - 1" class="sb-timeline-line" />
              </div>
              <div class="sb-timeline-body">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                  <span style="font-weight:700;font-size:0.92rem">{{ ev.title }}</span>
                  <span class="badge" :class="`badge-${ev.badge}`" style="font-size:0.7rem">{{ ev.status }}</span>
                </div>
                <div style="font-size:0.83rem;color:var(--text2);margin-bottom:4px">{{ ev.desc }}</div>
                <div style="font-size:0.75rem;color:var(--text2)">{{ ev.date }}</div>
              </div>
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('kanban')" v-show="activeSection === 'kanban'" class="sb-section">
        <h2 class="sb-section-title">Kanban Board</h2>
        <p class="sb-section-desc">Draggable cards across status columns using <code>.kanban</code> layout.</p>
        <SbStory :code="kanbanCode">
          <div class="kanban" style="min-height:200px">
            <div v-for="col in kanbanCols" :key="col.id" class="kanban-col"
              @dragover.prevent @drop="dropCard($event, col.id)">
              <h3 :style="{ color: col.color }">{{ col.label }} <span style="opacity:0.5;font-size:0.75rem">({{ cardsByCol(col.id).length }})</span></h3>
              <div v-for="card in cardsByCol(col.id)" :key="card.id"
                class="kanban-card" draggable="true"
                @dragstart="dragStart($event, card.id)"
                style="cursor:grab;border-left:3px solid transparent"
                :style="{ borderLeftColor: col.color }">
                <span>{{ card.text }}</span>
                <span class="badge" :class="`badge-${card.pri}`" style="font-size:0.68rem;flex-shrink:0">{{ card.priLabel }}</span>
              </div>
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('carousel')" v-show="activeSection === 'carousel'" class="sb-section">
        <h2 class="sb-section-title">Carousel</h2>
        <p class="sb-section-desc">Sliding card carousel with prev/next and dot indicators.</p>
        <SbStory :code="carouselCode">
          <div style="position:relative;overflow:hidden">
            <div style="display:flex;transition:transform .35s ease" :style="{ transform: `translateX(-${carouselIdx*100}%)` }">
              <div v-for="slide in carouselSlides" :key="slide.title"
                style="min-width:100%;padding:32px 24px;border-radius:10px;display:flex;flex-direction:column;gap:8px"
                :style="{ background: slide.bg }">
                <span style="font-size:2rem">{{ slide.emoji }}</span>
                <h3 style="font-weight:800;font-size:1.1rem">{{ slide.title }}</h3>
                <p style="font-size:.88rem;opacity:.8">{{ slide.desc }}</p>
              </div>
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px">
            <button class="btn btn-secondary btn-sm" @click="carouselIdx = (carouselIdx-1+carouselSlides.length)%carouselSlides.length">‹ Prev</button>
            <div style="display:flex;gap:6px">
              <button v-for="(_, i) in carouselSlides" :key="i"
                style="width:8px;height:8px;border-radius:50%;border:none;cursor:pointer;transition:background .2s"
                :style="carouselIdx===i ? 'background:var(--accent)' : 'background:var(--bg3)'"
                @click="carouselIdx=i" />
            </div>
            <button class="btn btn-secondary btn-sm" @click="carouselIdx = (carouselIdx+1)%carouselSlides.length">Next ›</button>
          </div>
        </SbStory>
      </section>

      <section :id="sid('drag-list')" v-show="activeSection === 'drag-list'" class="sb-section">
        <h2 class="sb-section-title">Drag &amp; Drop List</h2>
        <p class="sb-section-desc">Reorder items via HTML5 drag-and-drop — no third-party lib needed.</p>
        <SbStory :code="dragListCode">
          <div style="display:flex;flex-direction:column;gap:4px">
            <div v-for="(item, i) in dragItems" :key="item.id"
              draggable="true"
              style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--bg2);border:1px solid var(--bg3);border-radius:8px;cursor:grab;transition:all .15s;user-select:none"
              :style="dragOver===i ? 'border-color:var(--accent);background:rgba(99,102,241,.12)' : ''"
              @dragstart="dragListStart(i)" @dragover.prevent="dragOver=i" @drop="dragListDrop(i)" @dragend="dragOver=null">
              <span style="color:var(--text2);font-size:1rem;cursor:grab">⠿</span>
              <span style="font-size:1.1rem">{{ item.emoji }}</span>
              <span style="font-size:.9rem;font-weight:600;flex:1">{{ item.label }}</span>
              <span style="font-size:.75rem;color:var(--text2);font-family:monospace">#{{ i+1 }}</span>
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('typewriter')" v-show="activeSection === 'typewriter'" class="sb-section">
        <h2 class="sb-section-title">Typewriter Effect</h2>
        <p class="sb-section-desc">Animated character-by-character reveal with cursor blink.</p>
        <SbStory :code="typewriterCode">
          <div style="padding:16px;background:var(--bg2);border-radius:10px;border:1px solid var(--bg3)">
            <span style="font-size:1.35rem;font-weight:700;font-family:monospace">{{ twDisplayed }}<span style="border-right:2px solid var(--accent2);animation:sb-blink 1s step-start infinite;margin-left:1px">&nbsp;</span></span>
          </div>
          <div style="margin-top:10px;display:flex;gap:8px">
            <button class="btn btn-primary btn-sm" @click="twRestart">↺ Restart</button>
            <button class="btn btn-secondary btn-sm" @click="twPaused=!twPaused">{{ twPaused ? '▶ Play' : '⏸ Pause' }}</button>
          </div>
        </SbStory>
      </section>

      <section :id="sid('chat-bubbles')" v-show="activeSection === 'chat-bubbles'" class="sb-section">
        <h2 class="sb-section-title">Chat Bubbles</h2>
        <p class="sb-section-desc">Message thread with sent/received variants, timestamps, and input.</p>
        <SbStory :code="chatCode">
          <div style="display:flex;flex-direction:column;gap:10px;max-height:280px;overflow-y:auto;padding:4px">
            <div v-for="msg in chatMessages" :key="msg.id"
              style="display:flex;gap:8px"
              :style="msg.sent ? 'flex-direction:row-reverse' : ''">
              <div style="width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.9rem;flex-shrink:0;font-weight:700"
                :style="{ background: msg.sent ? 'var(--accent)' : 'var(--bg3)', color: msg.sent ? '#fff' : 'var(--text)' }">
                {{ msg.sent ? 'Me' : msg.from[0] }}
              </div>
              <div style="max-width:72%">
                <div style="padding:10px 14px;border-radius:12px;font-size:.88rem;line-height:1.5"
                  :style="msg.sent ? 'background:var(--accent);color:#fff;border-radius:12px 12px 4px 12px' : 'background:var(--bg2);border:1px solid var(--bg3);border-radius:12px 12px 12px 4px'">
                  {{ msg.text }}
                </div>
                <div style="font-size:.72rem;color:var(--text2);margin-top:3px;padding:0 4px"
                  :style="msg.sent ? 'text-align:right' : ''">{{ msg.time }}</div>
              </div>
            </div>
          </div>
          <div style="display:flex;gap:8px;margin-top:12px;border-top:1px solid var(--bg3);padding-top:12px">
            <input v-model="chatInput" class="input" style="flex:1" placeholder="Type a message…" @keyup.enter="sendChat" />
            <button class="btn btn-primary btn-sm" @click="sendChat" :disabled="!chatInput.trim()">Send</button>
          </div>
        </SbStory>
      </section>

      <section :id="sid('split-view')" v-show="activeSection === 'split-view'" class="sb-section">
        <h2 class="sb-section-title">Split View</h2>
        <p class="sb-section-desc">Resizable two-panel layout — drag the divider handle.</p>
        <SbStory :code="splitViewCode">
          <div style="display:flex;height:200px;border:1px solid var(--bg3);border-radius:10px;overflow:hidden;user-select:none"
            @mousemove="splitDragging && doSplit($event)"
            @mouseup="splitDragging=false"
            @mouseleave="splitDragging=false">
            <div style="overflow:auto;padding:16px;background:var(--bg2)"
              :style="{ width: splitPct + '%' }">
              <div style="font-weight:700;margin-bottom:8px;font-size:.88rem;color:var(--accent2)">Panel A</div>
              <p style="font-size:.82rem;color:var(--text2)">Left pane content. Drag the center handle to resize.</p>
            </div>
            <div style="width:6px;cursor:col-resize;background:var(--bg3);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:background .15s"
              @mousedown.prevent="splitDragging=true"
              @mouseenter="e=>(e.currentTarget as HTMLElement).style.background='var(--accent)'"
              @mouseleave="e=>(e.currentTarget as HTMLElement).style.background=splitDragging?'var(--accent)':'var(--bg3)'">
              <span style="color:var(--text2);font-size:.6rem">⋮</span>
            </div>
            <div style="flex:1;overflow:auto;padding:16px;background:var(--bg)">
              <div style="font-weight:700;margin-bottom:8px;font-size:.88rem;color:var(--green)">Panel B</div>
              <p style="font-size:.82rem;color:var(--text2)">Right pane content. Width: {{ (100 - splitPct - 1).toFixed(0) }}%</p>
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('onboarding')" v-show="activeSection === 'onboarding'" class="sb-section">
        <h2 class="sb-section-title">Onboarding Checklist</h2>
        <p class="sb-section-desc">Getting-started task list with progress bar and completion celebration.</p>
        <SbStory :code="onboardingCode">
          <div style="border:1px solid var(--bg3);border-radius:12px;overflow:hidden">
            <div style="padding:16px 18px;background:var(--bg2);border-bottom:1px solid var(--bg3)">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
                <span style="font-weight:700">Get started</span>
                <span style="font-size:.82rem;color:var(--text2)">{{ onboardDone }}/{{ onboardSteps.length }} complete</span>
              </div>
              <div style="height:6px;background:var(--bg3);border-radius:999px;overflow:hidden">
                <div style="height:100%;background:var(--green);border-radius:999px;transition:width .4s ease"
                  :style="{ width: (onboardDone/onboardSteps.length*100) + '%' }" />
              </div>
            </div>
            <div style="padding:8px">
              <div v-for="step in onboardSteps" :key="step.id"
                style="display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:8px;cursor:pointer;transition:background .1s"
                @click="step.done=!step.done"
                @mouseenter="e=>(e.currentTarget as HTMLElement).style.background='var(--bg3)'"
                @mouseleave="e=>(e.currentTarget as HTMLElement).style.background=''">
                <div style="width:20px;height:20px;border-radius:50%;border:2px solid;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:.7rem;transition:all .2s"
                  :style="step.done ? 'background:var(--green);border-color:var(--green);color:#fff' : 'border-color:var(--bg3);color:transparent'">✓</div>
                <span style="font-size:.88rem" :style="step.done ? 'text-decoration:line-through;color:var(--text2)' : ''">{{ step.title }}</span>
              </div>
            </div>
            <div v-if="onboardDone===onboardSteps.length"
              style="padding:12px 18px;background:rgba(16,185,129,.12);border-top:1px solid rgba(16,185,129,.3);text-align:center;font-size:.88rem;font-weight:700;color:var(--green)">
              🎉 All done! You're all set.
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('animations')" v-show="activeSection === 'animations'" class="sb-section">
        <h2 class="sb-section-title">Animations</h2>
        <p class="sb-section-desc">CSS keyframe animation showcase — click to replay.</p>
        <SbStory :code="animationsCode">
          <div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center">
            <div v-for="anim in animDemos" :key="anim.name"
              style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:20px;background:var(--bg2);border:1px solid var(--bg3);border-radius:12px;cursor:pointer;min-width:100px"
              @click="anim.key++"
              @mouseenter="e=>(e.currentTarget as HTMLElement).style.borderColor='var(--accent)'"
              @mouseleave="e=>(e.currentTarget as HTMLElement).style.borderColor='var(--bg3)'">
              <div style="width:44px;height:44px;background:var(--accent);border-radius:10px"
                :key="anim.key"
                :style="{ animation: anim.css }" />
              <span style="font-size:.78rem;color:var(--text2);font-family:monospace">{{ anim.name }}</span>
            </div>
          </div>
        </SbStory>
      </section>

      <!-- ════════════════ NEW CHARTS ════════════════ -->
      <section :id="sid('waterfall-chart')" v-show="activeSection === 'waterfall-chart'" class="sb-section">
        <h2 class="sb-section-title">Waterfall Chart</h2>
        <p class="sb-section-desc">Sequential +/− chart showing cumulative revenue changes.</p>
        <SbStory :code="waterfallCode">
          <svg viewBox="0 -10 420 210" style="width:100%;max-width:500px;display:block">
            <g v-for="(bar, i) in waterfallBars" :key="bar.label">
              <rect :x="10 + i*65" :y="wfBarY(bar)" :width="52" :height="wfBarH(bar)"
                :fill="bar.isTotal ? '#6366f1' : bar.value >= 0 ? '#22c55e' : '#ef4444'" rx="3"/>
              <text :x="10 + i*65 + 26" :y="wfBarY(bar) - 4" text-anchor="middle" style="font-size:9px;fill:var(--text2)">
                {{ bar.value > 0 && !bar.isTotal ? '+' : '' }}{{ bar.value }}
              </text>
              <text :x="10 + i*65 + 26" y="197" text-anchor="middle" style="font-size:9px;fill:var(--text2)">{{ bar.label }}</text>
            </g>
            <line x1="10" y1="178" x2="410" y2="178" stroke="var(--bg3)" stroke-width="1"/>
          </svg>
        </SbStory>
      </section>

      <section :id="sid('bubble-chart')" v-show="activeSection === 'bubble-chart'" class="sb-section">
        <h2 class="sb-section-title">Bubble Chart</h2>
        <p class="sb-section-desc">Three-dimensional scatter — X: speed, Y: satisfaction, size: market share.</p>
        <SbStory :code="bubbleChartCode">
          <svg viewBox="0 0 380 200" style="width:100%;max-width:480px;display:block;overflow:visible">
            <line x1="30" y1="10" x2="30" y2="175" stroke="var(--bg3)" stroke-width="1"/>
            <line x1="30" y1="175" x2="360" y2="175" stroke="var(--bg3)" stroke-width="1"/>
            <circle v-for="(b, i) in bubbleData" :key="b.label"
              :cx="30 + b.x * 3.3" :cy="175 - b.y * 1.6"
              :r="bubbleHover === i ? b.r + 5 : b.r"
              :fill="b.color + '88'" :stroke="b.color" stroke-width="2"
              style="cursor:pointer;transition:r .15s"
              @mouseenter="bubbleHover = i" @mouseleave="bubbleHover = null"/>
            <text v-for="b in bubbleData" :key="b.label + 't'"
              :x="30 + b.x * 3.3" :y="175 - b.y * 1.6 + 4"
              text-anchor="middle" style="font-size:9px;fill:#fff;font-weight:700;pointer-events:none">{{ b.label }}</text>
            <text x="190" y="198" text-anchor="middle" style="font-size:10px;fill:var(--text2)">Speed Score</text>
          </svg>
        </SbStory>
      </section>

      <section :id="sid('funnel-chart')" v-show="activeSection === 'funnel-chart'" class="sb-section">
        <h2 class="sb-section-title">Funnel Chart</h2>
        <p class="sb-section-desc">Conversion funnel — each stage shows count and overall conversion %.</p>
        <SbStory :code="funnelCode">
          <div style="display:flex;flex-direction:column;gap:6px;max-width:420px">
            <div v-for="(step, i) in funnelSteps" :key="step.label" style="display:flex;align-items:center;gap:12px">
              <div style="flex:1;height:44px;border-radius:4px;display:flex;align-items:center;padding:0 16px;font-weight:600;font-size:.88rem;color:#fff;justify-content:space-between;transition:width .3s"
                :style="{ background: step.color, width: (step.value / funnelMax * 100) + '%', minWidth:'160px' }">
                <span>{{ step.label }}</span>
                <span style="font-family:monospace">{{ step.value.toLocaleString() }}</span>
              </div>
              <span style="font-size:.78rem;color:var(--text2);min-width:44px;text-align:right">
                {{ i > 0 ? Math.round(step.value / funnelSteps[0].value * 100) + '%' : '100%' }}
              </span>
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('treemap-chart')" v-show="activeSection === 'treemap-chart'" class="sb-section">
        <h2 class="sb-section-title">Treemap</h2>
        <p class="sb-section-desc">Proportional rectangular area chart — sized by market weight %.</p>
        <SbStory :code="treemapCode">
          <svg viewBox="0 0 500 200" style="width:100%;max-width:520px;display:block;border-radius:8px;overflow:hidden">
            <rect v-for="r in treemapRects" :key="r.label"
              :x="r.x" :y="r.y" :width="r.w" :height="r.h"
              :fill="r.color + 'cc'" stroke="var(--bg1)" stroke-width="2"/>
            <text v-for="r in treemapRects" :key="r.label+'t'"
              :x="r.x + r.w/2" :y="r.y + r.h/2 - 6"
              text-anchor="middle" style="font-size:12px;fill:#fff;font-weight:700">{{ r.label }}</text>
            <text v-for="r in treemapRects" :key="r.label+'v'"
              :x="r.x + r.w/2" :y="r.y + r.h/2 + 10"
              text-anchor="middle" style="font-size:10px;fill:rgba(255,255,255,.8)">{{ r.value }}%</text>
          </svg>
        </SbStory>
      </section>

      <section :id="sid('candlestick')" v-show="activeSection === 'candlestick'" class="sb-section">
        <h2 class="sb-section-title">Candlestick Chart</h2>
        <p class="sb-section-desc">OHLC stock chart — green = bullish (close &gt; open), red = bearish.</p>
        <SbStory :code="candlestickCode">
          <svg viewBox="0 0 420 200" style="width:100%;max-width:480px;display:block">
            <line x1="30" y1="10" x2="30" y2="175" stroke="var(--bg3)" stroke-width="1"/>
            <line x1="30" y1="175" x2="410" y2="175" stroke="var(--bg3)" stroke-width="1"/>
            <g v-for="(c, i) in candleData" :key="c.d">
              <line :x1="55 + i*52" :y1="candleY(c.h)" :x2="55 + i*52" :y2="candleY(c.l)"
                :stroke="c.c >= c.o ? '#22c55e' : '#ef4444'" stroke-width="2"/>
              <rect :x="55 + i*52 - 10" :y="candleY(Math.max(c.o, c.c))"
                :width="20" :height="Math.max(2, Math.abs(candleY(c.o) - candleY(c.c)))"
                :fill="c.c >= c.o ? '#22c55e' : '#ef4444'" rx="2"/>
              <text :x="55 + i*52" y="193" text-anchor="middle" style="font-size:9px;fill:var(--text2)">{{ c.d }}</text>
            </g>
          </svg>
        </SbStory>
      </section>

      <section :id="sid('multi-line')" v-show="activeSection === 'multi-line'" class="sb-section">
        <h2 class="sb-section-title">Multi-line Chart</h2>
        <p class="sb-section-desc">Three-series time series — Revenue, Expenses, Profit over 12 months.</p>
        <SbStory :code="multiLineCode">
          <div style="display:flex;gap:16px;margin-bottom:10px;flex-wrap:wrap">
            <div v-for="s in mlSeries" :key="s.name" style="display:flex;align-items:center;gap:6px;font-size:.82rem">
              <div style="width:20px;height:3px;border-radius:2px" :style="{ background: s.color }"/>
              {{ s.name }}
            </div>
          </div>
          <svg viewBox="0 0 510 180" style="width:100%;max-width:520px;display:block">
            <line x1="30" y1="10" x2="30" y2="162" stroke="var(--bg3)" stroke-width="1"/>
            <line x1="30" y1="162" x2="510" y2="162" stroke="var(--bg3)" stroke-width="1"/>
            <polyline v-for="s in mlSeries" :key="s.name"
              :points="mlPoints(s.values)" fill="none"
              :stroke="s.color" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
            <text v-for="(m, i) in mlMonths" :key="m"
              :x="30 + (i / 11) * 470" y="177"
              text-anchor="middle" style="font-size:8px;fill:var(--text2)">{{ m }}</text>
          </svg>
        </SbStory>
      </section>

      <!-- ════════════════ SPREADSHEETS ════════════════ -->
      <section :id="sid('pivot-table')" v-show="activeSection === 'pivot-table'" class="sb-section">
        <h2 class="sb-section-title">Pivot Table</h2>
        <p class="sb-section-desc">Sales data pivoted by Region × Product with row/column totals.</p>
        <SbStory :code="pivotCode">
          <div class="sb-table-wrap">
            <table class="sb-table">
              <thead>
                <tr>
                  <th>Region</th>
                  <th v-for="p in pivotProducts" :key="p">{{ p }}</th>
                  <th style="color:var(--accent2)">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in pivotRegions" :key="r">
                  <td style="font-weight:600">{{ r }}</td>
                  <td v-for="p in pivotProducts" :key="p" style="text-align:right;font-family:monospace">{{ pivotCell(r, p) }}</td>
                  <td style="font-weight:700;color:var(--accent2);text-align:right;font-family:monospace">{{ pivotRowTotal(r) }}</td>
                </tr>
                <tr style="border-top:2px solid var(--accent)">
                  <td style="font-weight:600;color:var(--accent2)">Total</td>
                  <td v-for="p in pivotProducts" :key="p" style="font-weight:700;text-align:right;font-family:monospace">{{ pivotColTotal(p) }}</td>
                  <td style="font-weight:800;color:var(--accent);text-align:right;font-family:monospace">{{ pivotGrandTotal }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SbStory>
      </section>

      <section :id="sid('spreadsheet')" v-show="activeSection === 'spreadsheet'" class="sb-section">
        <h2 class="sb-section-title">Spreadsheet</h2>
        <p class="sb-section-desc">Editable grid — last column auto-sums the row, bottom row sums each column.</p>
        <SbStory :code="spreadsheetCode">
          <div class="sb-table-wrap">
            <table class="sb-table sb-spreadsheet">
              <thead>
                <tr>
                  <th style="width:36px;text-align:center">#</th>
                  <th v-for="h in ssHeaders" :key="h" style="text-align:center">{{ h }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, ri) in ssData" :key="ri">
                  <td style="text-align:center;color:var(--text2);font-size:.75rem">{{ ri + 1 }}</td>
                  <td v-for="ci in 4" :key="ci" style="padding:0">
                    <input class="sb-cell-input" v-model="ssData[ri][ci - 1]" />
                  </td>
                  <td style="text-align:right;padding-right:12px;font-weight:700;color:var(--accent2);font-family:monospace">
                    {{ ssRowSum(ri) }}
                  </td>
                </tr>
                <tr style="border-top:2px solid var(--accent)">
                  <td style="text-align:center;color:var(--text2);font-size:.9rem">Σ</td>
                  <td v-for="ci in 4" :key="ci" style="text-align:right;padding-right:12px;font-weight:700;color:var(--accent);font-family:monospace">
                    {{ ssColSum(ci - 1) }}
                  </td>
                  <td style="text-align:right;padding-right:12px;font-weight:800;color:var(--accent);font-family:monospace">
                    {{ ssGrandTotal }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </SbStory>
      </section>

      <section :id="sid('sort-table')" v-show="activeSection === 'sort-table'" class="sb-section">
        <h2 class="sb-section-title">Sortable Table</h2>
        <p class="sb-section-desc">Click column headers to sort ascending/descending. Filter across all fields.</p>
        <SbStory :code="sortTableCode">
          <div style="margin-bottom:12px">
            <input class="sb-search-input" v-model="stFilter" placeholder="Filter rows…" style="max-width:260px"/>
          </div>
          <div class="sb-table-wrap">
            <table class="sb-table">
              <thead>
                <tr>
                  <th v-for="col in stCols" :key="col.key" @click="stToggleSort(col.key)" style="cursor:pointer;user-select:none">
                    {{ col.label }}
                    <span style="font-size:.7rem;margin-left:3px">{{ stSortCol === col.key ? (stSortAsc ? '▲' : '▼') : '⇅' }}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in stSorted" :key="row.name">
                  <td>{{ row.name }}</td>
                  <td>{{ row.dept }}</td>
                  <td style="text-align:right;font-family:monospace">${{ row.salary.toLocaleString() }}</td>
                  <td>
                    <span class="badge" :style="{
                      background: row.status==='Active' ? '#22c55e22' : row.status==='Leave' ? '#f59e0b22' : '#ef444422',
                      color:      row.status==='Active' ? '#22c55e'   : row.status==='Leave' ? '#f59e0b'   : '#ef4444' }">
                      {{ row.status }}
                    </span>
                  </td>
                  <td style="font-family:monospace">{{ row.joined }}</td>
                </tr>
                <tr v-if="!stSorted.length">
                  <td colspan="5" style="text-align:center;color:var(--text2);padding:24px">No results</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SbStory>
      </section>

      <section :id="sid('comparison')" v-show="activeSection === 'comparison'" class="sb-section">
        <h2 class="sb-section-title">Comparison Table</h2>
        <p class="sb-section-desc">Feature matrix for pricing plan comparison — ✓/✗ per plan.</p>
        <SbStory :code="comparisonCode">
          <div class="sb-table-wrap">
            <table class="sb-table">
              <thead>
                <tr>
                  <th style="min-width:180px">Feature</th>
                  <th v-for="plan in cmpPlans" :key="plan.name" style="text-align:center;min-width:110px">
                    <div style="font-weight:800;font-size:.88rem">{{ plan.name }}</div>
                    <div style="font-size:.75rem;color:var(--text2);margin-top:2px">{{ plan.price }}</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="feat in cmpFeatures" :key="feat">
                  <td style="font-weight:500;font-size:.85rem">{{ feat }}</td>
                  <td v-for="plan in cmpPlans" :key="plan.name" style="text-align:center">
                    <span :style="{ color: plan.features.includes(feat) ? '#22c55e' : '#ef4444', fontWeight:700, fontSize:'1.1rem' }">
                      {{ plan.features.includes(feat) ? '✓' : '✗' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </SbStory>
      </section>

      <section :id="sid('crosstab')" v-show="activeSection === 'crosstab'" class="sb-section">
        <h2 class="sb-section-title">Cross-Tab</h2>
        <p class="sb-section-desc">Cross-tabulation of headcount by Department × Quarter.</p>
        <SbStory :code="crosstabCode">
          <div class="sb-table-wrap">
            <table class="sb-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th v-for="q in ctQuarters" :key="q" style="text-align:center">{{ q }}</th>
                  <th style="text-align:center;color:var(--accent2)">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="dept in ctDepts" :key="dept">
                  <td style="font-weight:600">{{ dept }}</td>
                  <td v-for="q in ctQuarters" :key="q" style="text-align:center;font-family:monospace">{{ ctCell(dept, q) }}</td>
                  <td style="text-align:center;font-weight:700;color:var(--accent2);font-family:monospace">{{ ctRowTotal(dept) }}</td>
                </tr>
                <tr style="border-top:2px solid var(--accent)">
                  <td style="font-weight:600;color:var(--accent2)">Total</td>
                  <td v-for="q in ctQuarters" :key="q" style="text-align:center;font-weight:700;font-family:monospace">{{ ctColTotal(q) }}</td>
                  <td style="text-align:center;font-weight:800;color:var(--accent);font-family:monospace">{{ ctGrandTotal }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SbStory>
      </section>

      <section :id="sid('freeze-table')" v-show="activeSection === 'freeze-table'" class="sb-section">
        <h2 class="sb-section-title">Freeze Columns</h2>
        <p class="sb-section-desc">First column is sticky (frozen) while the table scrolls horizontally.</p>
        <SbStory :code="freezeTableCode">
          <div class="sb-table-wrap" style="overflow-x:auto;max-width:100%">
            <table class="sb-table" style="min-width:700px">
              <thead>
                <tr>
                  <th class="sb-sticky-col">Company</th>
                  <th v-for="h in ftHeaders" :key="h" style="text-align:right">{{ h }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in ftRows" :key="row[0]">
                  <td class="sb-sticky-col" style="font-weight:600">{{ row[0] }}</td>
                  <td v-for="(cell, i) in row.slice(1)" :key="i" style="text-align:right;font-family:monospace">{{ cell }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SbStory>
      </section>

      <section :id="sid('row-select')" v-show="activeSection === 'row-select'" class="sb-section">
        <h2 class="sb-section-title">Row Selection</h2>
        <p class="sb-section-desc">Checkbox multi-select with select-all and bulk delete action.</p>
        <SbStory :code="rowSelectCode">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;min-height:32px">
            <span style="font-size:.85rem;color:var(--text2)">{{ rsSelected.length }} of {{ rsRows.length }} selected</span>
            <button class="btn btn-secondary btn-sm" :disabled="!rsSelected.length"
              :style="{ opacity: rsSelected.length ? 1 : .4 }" @click="rsDelete">
              🗑 Delete selected
            </button>
          </div>
          <div class="sb-table-wrap">
            <table class="sb-table">
              <thead>
                <tr>
                  <th style="width:36px"><input type="checkbox" v-model="rsAllSelected"/></th>
                  <th>Project</th><th>Status</th><th>Budget</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in rsRows" :key="row.id"
                  :style="{ background: rsSelected.includes(row.id) ? 'rgba(99,102,241,.08)' : '' }">
                  <td><input type="checkbox" :value="row.id" v-model="rsSelected"/></td>
                  <td style="font-weight:500">{{ row.name }}</td>
                  <td>
                    <span class="badge" :style="{
                      background: row.status==='Active' ? '#22c55e22' : row.status==='Complete' ? '#6366f122' : '#f59e0b22',
                      color:      row.status==='Active' ? '#22c55e'   : row.status==='Complete' ? '#6366f1'   : '#f59e0b' }">
                      {{ row.status }}
                    </span>
                  </td>
                  <td style="font-family:monospace">{{ row.budget }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SbStory>
      </section>

      <!-- ════════════════ ADVANCED ════════════════ -->
      <section :id="sid('virtual-list')" v-show="activeSection === 'virtual-list'" class="sb-section">
        <h2 class="sb-section-title">Virtual List</h2>
        <p class="sb-section-desc">10,000 rows — only the ~10 visible rows are in the DOM at any time.</p>
        <SbStory :code="virtualListCode">
          <div class="sb-virtual-container" @scroll="vlOnScroll">
            <div :style="{ height: vlAllItems.length * vlItemHeight + 'px', position:'relative' }">
              <div v-for="(item, idx) in vlVisible" :key="item.id"
                :style="{ position:'absolute', top: (vlStartIdx + idx) * vlItemHeight + 'px', left:0, right:0 }"
                class="sb-virtual-row">
                <span style="color:var(--text2);font-size:.78rem;min-width:70px;font-family:monospace">{{ item.id }}</span>
                <span style="flex:1">{{ item.name }}</span>
                <span style="font-family:monospace;color:var(--accent2)">{{ item.value }}</span>
              </div>
            </div>
          </div>
          <div style="margin-top:8px;font-size:.78rem;color:var(--text2)">
            Showing rows {{ vlStartIdx + 1 }}–{{ Math.min(vlStartIdx + 10, vlAllItems.length) }} of {{ vlAllItems.length.toLocaleString() }}
          </div>
        </SbStory>
      </section>

      <section :id="sid('rich-text')" v-show="activeSection === 'rich-text'" class="sb-section">
        <h2 class="sb-section-title">Rich Text Editor</h2>
        <p class="sb-section-desc">Contenteditable with a formatting toolbar — bold, italic, lists, alignment.</p>
        <SbStory :code="richTextCode">
          <div class="sb-rte">
            <div class="sb-rte-toolbar">
              <button class="sb-rte-btn" @click="rtExec('bold')" title="Bold"><b>B</b></button>
              <button class="sb-rte-btn" @click="rtExec('italic')" title="Italic"><i>I</i></button>
              <button class="sb-rte-btn" @click="rtExec('underline')" title="Underline"><u>U</u></button>
              <button class="sb-rte-btn" @click="rtExec('strikeThrough')" title="Strike"><s>S</s></button>
              <div class="sb-rte-sep"/>
              <button class="sb-rte-btn" @click="rtExec('insertUnorderedList')" title="Bullets">• List</button>
              <button class="sb-rte-btn" @click="rtExec('insertOrderedList')" title="Numbers">1. List</button>
              <div class="sb-rte-sep"/>
              <button class="sb-rte-btn" @click="rtExec('justifyLeft')" title="Left">⬤L</button>
              <button class="sb-rte-btn" @click="rtExec('justifyCenter')" title="Center">⬤C</button>
              <button class="sb-rte-btn" @click="rtExec('justifyRight')" title="Right">⬤R</button>
              <div class="sb-rte-sep"/>
              <button class="sb-rte-btn" @click="rtExec('removeFormat')" title="Clear formatting" style="color:var(--text2)">✕ Clear</button>
            </div>
            <div ref="rtEl" class="sb-rte-body" contenteditable="true">
              <p>Start typing here… <b>bold</b>, <i>italic</i>, <u>underline</u> — all work.</p>
              <p>Select any text and use the toolbar to format it.</p>
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('date-picker')" v-show="activeSection === 'date-picker'" class="sb-section">
        <h2 class="sb-section-title">Date Picker</h2>
        <p class="sb-section-desc">Full month calendar with prev/next navigation and day selection.</p>
        <SbStory :code="datePickerCode">
          <div class="sb-calendar">
            <div class="sb-cal-header">
              <button class="btn btn-secondary btn-sm" @click="dpPrev">‹</button>
              <span style="font-weight:700;min-width:140px;text-align:center">{{ dpMonthName }} {{ dpYear }}</span>
              <button class="btn btn-secondary btn-sm" @click="dpNext">›</button>
            </div>
            <div class="sb-cal-grid">
              <div v-for="d in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="d" class="sb-cal-day-name">{{ d }}</div>
              <div v-for="(day, i) in dpDays" :key="i"
                class="sb-cal-day"
                :class="{ 'sb-cal-day--empty': !day, 'sb-cal-day--selected': day && dpKey(day) === dpSelected }"
                @click="day && (dpSelected = dpKey(day))">
                {{ day }}
              </div>
            </div>
            <div style="margin-top:12px;font-size:.85rem;color:var(--text2)">
              Selected: <strong style="color:var(--accent2)">{{ dpSelected || '—' }}</strong>
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('file-upload')" v-show="activeSection === 'file-upload'" class="sb-section">
        <h2 class="sb-section-title">File Upload</h2>
        <p class="sb-section-desc">Drag-and-drop zone with file list, size display, and remove button.</p>
        <SbStory :code="fileUploadCode">
          <div class="sb-dropzone" :class="{ 'sb-dropzone--active': fuDragging }"
            @dragover.prevent="fuDragging = true"
            @dragleave.prevent="fuDragging = false"
            @drop.prevent="fuDrop">
            <div style="font-size:2.2rem;margin-bottom:8px">📂</div>
            <div style="font-weight:600;margin-bottom:4px">Drop files here</div>
            <div style="font-size:.82rem;color:var(--text2);margin-bottom:12px">or click to browse</div>
            <label class="btn btn-secondary btn-sm" style="cursor:pointer">
              Browse files
              <input type="file" multiple style="display:none" @change="fuPick"/>
            </label>
          </div>
          <div v-if="fuFiles.length" style="margin-top:14px;display:flex;flex-direction:column;gap:6px">
            <div v-for="(f, i) in fuFiles" :key="i" class="sb-file-item">
              <span>📄</span>
              <span style="flex:1;font-size:.85rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ f.name }}</span>
              <span style="font-size:.75rem;color:var(--text2);white-space:nowrap">{{ f.size }}</span>
              <button style="background:none;border:none;cursor:pointer;color:var(--text2);padding:0 4px;font-size:1rem" @click="fuFiles.splice(i,1)">✕</button>
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('dashboard')" v-show="activeSection === 'dashboard'" class="sb-section">
        <h2 class="sb-section-title">Dashboard</h2>
        <p class="sb-section-desc">Multi-widget analytics dashboard — stat cards, sparkline, and traffic breakdown.</p>
        <SbStory :code="dashboardCode">
          <div class="sb-dashboard">
            <div v-for="s in dashStats" :key="s.label" class="sb-dash-stat">
              <div style="font-size:.75rem;color:var(--text2);margin-bottom:4px;font-weight:600;text-transform:uppercase;letter-spacing:.04em">{{ s.label }}</div>
              <div style="font-size:1.6rem;font-weight:800;letter-spacing:-.5px">{{ s.value }}</div>
              <div style="font-size:.78rem;margin-top:4px" :style="{ color: s.up ? '#22c55e' : '#ef4444' }">
                {{ s.up ? '▲' : '▼' }} {{ s.change }} vs last month
              </div>
            </div>
            <div class="sb-dash-chart" style="grid-column:span 2">
              <div style="font-size:.75rem;color:var(--text2);margin-bottom:8px;font-weight:600;text-transform:uppercase;letter-spacing:.04em">Revenue (12 months)</div>
              <svg viewBox="0 0 290 60" style="width:100%">
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#6366f1" stop-opacity=".3"/>
                    <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
                  </linearGradient>
                </defs>
                <polyline :points="mlSeries[0].values.map((v,i) => `${i/11*290},${60 - v/100*58}`).join(' ')"
                  fill="none" stroke="#6366f1" stroke-width="2" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="sb-dash-chart">
              <div style="font-size:.75rem;color:var(--text2);margin-bottom:10px;font-weight:600;text-transform:uppercase;letter-spacing:.04em">Traffic Sources</div>
              <div v-for="src in dashSources" :key="src.label" style="margin-bottom:8px">
                <div style="display:flex;justify-content:space-between;font-size:.78rem;margin-bottom:3px">
                  <span>{{ src.label }}</span>
                  <span style="color:var(--text2)">{{ src.pct }}%</span>
                </div>
                <div style="height:5px;background:var(--bg3);border-radius:3px">
                  <div style="height:100%;border-radius:3px;transition:width .4s" :style="{ width: src.pct+'%', background: src.color }"/>
                </div>
              </div>
            </div>
          </div>
        </SbStory>
      </section>

      <section :id="sid('gantt-chart')" v-show="activeSection === 'gantt-chart'" class="sb-section">
        <h2 class="sb-section-title">Gantt Chart</h2>
        <p class="sb-section-desc">Project timeline with named tasks, day markers, and overlapping bars.</p>
        <SbStory :code="ganttCode">
          <div style="overflow-x:auto">
            <svg :viewBox="`0 0 ${70 + ganttTotalDays * 32} ${32 + ganttTasks.length * 42}`"
              :width="70 + ganttTotalDays * 32" style="display:block;max-width:100%;min-width:300px">
              <rect x="70" y="0" :width="ganttTotalDays * 32" height="26" fill="var(--bg3)" rx="0"/>
              <text v-for="d in ganttTotalDays" :key="d"
                :x="70 + (d-1)*32 + 16" y="17"
                text-anchor="middle" style="font-size:9px;fill:var(--text2)">D{{ d }}</text>
              <g v-for="(task, i) in ganttTasks" :key="task.name">
                <rect x="0" :y="30 + i*42" width="68" :height="30" fill="var(--bg2)"/>
                <text x="6" :y="30 + i*42 + 19" style="font-size:10px;fill:var(--text1)">{{ task.name }}</text>
                <rect
                  :x="70 + task.start * 32 + 2"
                  :y="34 + i*42"
                  :width="task.duration * 32 - 4"
                  :height="22"
                  :fill="task.color" rx="5"/>
                <text
                  :x="70 + task.start * 32 + task.duration * 16"
                  :y="34 + i*42 + 15"
                  text-anchor="middle" style="font-size:9px;fill:#fff;font-weight:700">{{ task.duration }}d</text>
              </g>
              <line v-for="d in ganttTotalDays + 1" :key="d"
                :x1="70 + (d-1)*32" y1="26"
                :x2="70 + (d-1)*32" :y2="30 + ganttTasks.length * 42"
                stroke="var(--bg3)" stroke-width="1"/>
            </svg>
          </div>
        </SbStory>
      </section>

      <section :id="sid('json-viewer')" v-show="activeSection === 'json-viewer'" class="sb-section">
        <h2 class="sb-section-title">JSON Viewer</h2>
        <p class="sb-section-desc">Collapsible JSON tree — click ▾/▸ to expand or collapse any node.</p>
        <SbStory :code="jsonViewerCode">
          <div style="background:var(--bg2);border:1px solid var(--bg3);border-radius:8px;padding:16px;overflow:auto;max-height:320px">
            <JsonNode :data="jsonViewerData" :depth="0"/>
          </div>
        </SbStory>
      </section>

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineComponent, nextTick, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'

// ── v-focus directive ─────────────────────────────────────────────────────
const vFocus = { mounted: (el: HTMLElement) => el.focus() }
const vAutofocus = { mounted: (el: HTMLElement) => nextTick(() => el.focus()) }

// ── TreeNode component ────────────────────────────────────────────────────
interface ITreeNode { id: string; label: string; icon?: string; children?: ITreeNode[] }
const TreeNode = defineComponent({
  name: 'TreeNode',
  props: { node: Object as () => ITreeNode, depth: Number },
  setup(props) {
    const open = ref(true)
    return { open }
  },
  template: `
    <div :style="{ paddingLeft: (depth || 0)*16 + 'px' }">
      <div style="display:flex;align-items:center;gap:6px;padding:4px 6px;border-radius:5px;cursor:pointer;transition:background .1s"
        @click="node.children && (open=!open)"
        @mouseenter="e => e.currentTarget.style.background='var(--bg3)'"
        @mouseleave="e => e.currentTarget.style.background=''">
        <span v-if="node.children" style="color:var(--text2);font-size:.65rem;transition:transform .15s;display:inline-block" :style="open?'transform:rotate(90deg)':''">▶</span>
        <span v-else style="display:inline-block;width:10px"/>
        <span>{{ node.children ? (open ? '📂' : '📁') : (node.icon || '📄') }}</span>
        <span style="font-size:.85rem">{{ node.label }}</span>
      </div>
      <template v-if="open && node.children">
        <TreeNode v-for="child in node.children" :key="child.id" :node="child" :depth="(depth||0)+1" />
      </template>
    </div>
  `,
})

// ── SbStory ──────────────────────────────────────────────────────────────
const SbStory = defineComponent({
  props: {
    code: { type: String, required: true },
    row:  { type: Boolean, default: false },
  },
  setup(props) {
    const open   = ref(false)
    const copied = ref(false)
    function copy() {
      navigator.clipboard.writeText(props.code)
      copied.value = true; setTimeout(() => copied.value = false, 2000)
    }
    return { open, copied, copy }
  },
  template: `
    <div class="sb-story">
      <div :class="['sb-demo', row && 'sb-demo-row']">
        <slot />
        <button class="sb-code-btn" :class="{ active: open }" @click="open = !open" title="Toggle code">
          <span class="sb-code-btn-icon">&lt;/&gt;</span>
          <span class="sb-code-btn-label">{{ open ? 'Hide' : 'Code' }}</span>
        </button>
      </div>
      <div v-if="open" class="sb-code-panel">
        <div class="sb-code-panel-bar">
          <span class="sb-code-lang">vue</span>
          <button class="sb-copy-btn" @click="copy">{{ copied ? '✓ Copied!' : 'Copy' }}</button>
        </div>
        <pre class="sb-code-pre"><code>{{ code }}</code></pre>
      </div>
    </div>
  `,
})

// ── Nav ───────────────────────────────────────────────────────────────────
const sid = (id: string) => id
const search        = ref('')
const activeSection = ref('colors')
const mainEl        = ref<HTMLElement | null>(null)

const groups = [
  { label: 'Foundation', items: [
    { id: 'colors',     label: 'Colors' },
    { id: 'typography', label: 'Typography' },
    { id: 'layout',     label: 'Layout Utilities' },
    { id: 'spacing',    label: 'Spacing Scale' },
    { id: 'shadows',    label: 'Shadows' },
    { id: 'borders',    label: 'Borders & Radius' },
  ]},
  { label: 'Controls', items: [
    { id: 'buttons',      label: 'Buttons' },
    { id: 'inputs',       label: 'Inputs' },
    { id: 'toggle',       label: 'Toggle Switch' },
    { id: 'tabs',         label: 'Tabs' },
    { id: 'rating',       label: 'Star Rating' },
    { id: 'checkbox',     label: 'Checkbox Group' },
    { id: 'radio',        label: 'Radio Group' },
    { id: 'stepper-input',label: 'Number Stepper' },
    { id: 'color-input',  label: 'Color Input' },
    { id: 'search-input', label: 'Search Input' },
    { id: 'range-slider', label: 'Range Slider' },
    { id: 'select',       label: 'Select / Combobox' },
  ]},
  { label: 'Display', items: [
    { id: 'cards',       label: 'Cards' },
    { id: 'badges',      label: 'Badges' },
    { id: 'alerts',      label: 'Alerts' },
    { id: 'stat-grid',   label: 'Stat Grid' },
    { id: 'progress',    label: 'Progress Bar' },
    { id: 'avatars',     label: 'Avatars' },
    { id: 'chips',       label: 'Chips / Tags' },
    { id: 'kbd',         label: 'Keyboard Keys' },
    { id: 'dividers',    label: 'Dividers' },
    { id: 'empty-state', label: 'Empty State' },
    { id: 'list-items',  label: 'List Items' },
    { id: 'code-block',  label: 'Code Block' },
    { id: 'accordion',   label: 'Accordion' },
    { id: 'banner',      label: 'Banner / Callout' },
    { id: 'icon-grid',   label: 'Icon Grid' },
    { id: 'meter',       label: 'Meter / Level' },
    { id: 'status-ind',  label: 'Status Indicators' },
  ]},
  { label: 'Charts', items: [
    { id: 'line-chart',   label: 'Line Chart' },
    { id: 'bar-chart',    label: 'Bar Chart' },
    { id: 'donut-chart',  label: 'Donut Chart' },
    { id: 'sparkline',    label: 'Sparkline' },
    { id: 'gauge',        label: 'Gauge' },
    { id: 'heatmap',      label: 'Heatmap' },
    { id: 'area-chart',   label: 'Area Chart' },
    { id: 'hbar-chart',   label: 'Horizontal Bar' },
    { id: 'pie-chart',    label: 'Pie Chart' },
    { id: 'scatter-chart',label: 'Scatter Plot' },
    { id: 'radar-chart',  label: 'Radar Chart' },
    { id: 'stacked-bar',     label: 'Stacked Bar' },
    { id: 'waterfall-chart', label: 'Waterfall Chart' },
    { id: 'bubble-chart',    label: 'Bubble Chart' },
    { id: 'funnel-chart',    label: 'Funnel Chart' },
    { id: 'treemap-chart',   label: 'Treemap' },
    { id: 'candlestick',     label: 'Candlestick' },
    { id: 'multi-line',      label: 'Multi-line Chart' },
  ]},
  { label: 'Data', items: [
    { id: 'data-table',  label: 'Data Table' },
    { id: 'data-grid',   label: 'Spreadsheet Grid' },
    { id: 'pagination',  label: 'Pagination' },
    { id: 'tree-view',   label: 'Tree View' },
    { id: 'filter-bar',  label: 'Filter Bar' },
    { id: 'csv-export',  label: 'CSV Export' },
    { id: 'inline-edit', label: 'Inline Edit' },
  ]},
  { label: 'Navigation', items: [
    { id: 'breadcrumb',     label: 'Breadcrumb' },
    { id: 'stepper',        label: 'Stepper' },
    { id: 'dropdown',       label: 'Dropdown Menu' },
    { id: 'vertical-tabs',  label: 'Vertical Tabs' },
    { id: 'underline-tabs', label: 'Underline Tabs' },
    { id: 'command-palette',label: 'Command Palette' },
    { id: 'context-menu',   label: 'Context Menu' },
    { id: 'nav-links',      label: 'Link Variants' },
  ]},
  { label: 'Feedback', items: [
    { id: 'modal',           label: 'Modal' },
    { id: 'tooltip',         label: 'Tooltip' },
    { id: 'spinner',         label: 'Spinner' },
    { id: 'skeleton',        label: 'Skeleton Loader' },
    { id: 'toast',           label: 'Toast' },
    { id: 'popover',         label: 'Popover' },
    { id: 'drawer',          label: 'Drawer' },
    { id: 'confirm-dialog',  label: 'Confirm Dialog' },
    { id: 'loading-states',  label: 'Loading States' },
    { id: 'notif-bell',      label: 'Notification Bell' },
    { id: 'progress-steps',  label: 'Progress Steps' },
  ]},
  { label: 'Patterns', items: [
    { id: 'flashcard',   label: 'Flashcard' },
    { id: 'timeline',    label: 'Timeline' },
    { id: 'kanban',      label: 'Kanban Board' },
    { id: 'carousel',    label: 'Carousel' },
    { id: 'drag-list',   label: 'Drag & Drop List' },
    { id: 'typewriter',  label: 'Typewriter Effect' },
    { id: 'chat-bubbles',label: 'Chat Bubbles' },
    { id: 'split-view',  label: 'Split View' },
    { id: 'onboarding',  label: 'Onboarding Checklist' },
    { id: 'animations',  label: 'Animations' },
  ]},
  { label: 'Spreadsheets', items: [
    { id: 'pivot-table',  label: 'Pivot Table' },
    { id: 'spreadsheet',  label: 'Spreadsheet' },
    { id: 'sort-table',   label: 'Sortable Table' },
    { id: 'comparison',   label: 'Comparison Table' },
    { id: 'crosstab',     label: 'Cross-Tab' },
    { id: 'freeze-table', label: 'Freeze Columns' },
    { id: 'row-select',   label: 'Row Selection' },
  ]},
  { label: 'Advanced', items: [
    { id: 'virtual-list', label: 'Virtual List' },
    { id: 'rich-text',    label: 'Rich Text Editor' },
    { id: 'date-picker',  label: 'Date Picker' },
    { id: 'file-upload',  label: 'File Upload' },
    { id: 'dashboard',    label: 'Dashboard' },
    { id: 'gantt-chart',  label: 'Gantt Chart' },
    { id: 'json-viewer',  label: 'JSON Viewer' },
  ]},
]

const filteredGroups = computed(() => {
  if (!search.value.trim()) return groups
  const q = search.value.toLowerCase()
  return groups
    .map(g => ({ ...g, items: g.items.filter(i => i.label.toLowerCase().includes(q)) }))
    .filter(g => g.items.length > 0)
})

const allItems = computed(() => groups.flatMap(g => g.items))

const currentGroupLabel = computed(() => {
  for (const g of groups) {
    if (g.items.some(i => i.id === activeSection.value)) return g.label
  }
  return ''
})
const currentSectionLabel = computed(() =>
  allItems.value.find(i => i.id === activeSection.value)?.label ?? ''
)
const prevId = computed(() => {
  const idx = allItems.value.findIndex(i => i.id === activeSection.value)
  return idx > 0 ? allItems.value[idx - 1].id : null
})
const nextId = computed(() => {
  const idx = allItems.value.findIndex(i => i.id === activeSection.value)
  return idx !== -1 && idx < allItems.value.length - 1 ? allItems.value[idx + 1].id : null
})

function scrollTo(id: string) {
  activeSection.value = id
  mainEl.value?.scrollTo({ top: 0 })
}

// ── Basic demo state ──────────────────────────────────────────────────────
const sliderVal  = ref(65)
const modalOpen  = ref(false)
const modalDelete = ref(false)
const modalForm   = ref(false)
const activeTab  = ref('Overview')
const tabItems   = ['Overview', 'Props', 'Events', 'Slots']
const cardFlipped= ref(false)
const rating     = ref(3)
const hoverStar  = ref(0)
const chips      = ref(['Vue 3', 'TypeScript', 'Vite', 'Router', 'Pinia'])
const toggles    = ref([
  { label: 'Notifications', on: true  },
  { label: 'Dark mode',     on: true  },
  { label: 'Auto-save',     on: false },
])

// ── Tooltip Vue-driven state ──────────────────────────────────────────────
const tipHover     = ref<number | null>(null)
const tipPin       = ref<number | null>(null)
const tooltipDemos = [
  { label: 'Hover me',     text: 'A simple tooltip with arrow pointer' },
  { label: 'Click to pin', text: 'Pinned! Click again to close' },
  { label: 'Info tip',     text: 'ℹ Use tooltips for contextual help' },
]

// ── Toast preview variants ────────────────────────────────────────────────
const toastVariants = [
  { type: 'success', icon: '✓', msg: 'File saved successfully!' },
  { type: 'error',   icon: '✗', msg: 'Upload failed. Please retry.' },
  { type: 'info',    icon: 'ℹ', msg: 'New version v2.1 available.' },
  { type: 'warn',    icon: '⚠', msg: 'Storage at 89% capacity.' },
]

// ── Dropdown ──────────────────────────────────────────────────────────────
const dropOpen   = ref<number | null>(null)
const dropSelect = ref(false)
const dropSelected = ref('')
const dropOptions = ['Vue 3', 'React', 'Svelte', 'Angular', 'Solid']
onMounted(() => document.addEventListener('click', closeDropdowns))
onUnmounted(() => document.removeEventListener('click', closeDropdowns))
function closeDropdowns(e: MouseEvent) {
  if (!(e.target as HTMLElement).closest('.sb-dropdown, [data-dropdown]')) {
    dropOpen.value = null; dropSelect.value = false
  }
}
const dropdowns = [
  {
    label: 'Actions',
    items: [
      { icon: '✏️', label: 'Edit',        shortcut: '⌘E' },
      { icon: '📋', label: 'Duplicate',   shortcut: '⌘D' },
      { icon: '📤', label: 'Export',      shortcut: '' },
      { divider: true },
      { icon: '🗑',  label: 'Delete',     shortcut: '⌫', danger: true },
    ],
  },
  {
    label: 'Profile',
    items: [
      { icon: '👤', label: 'View Profile', shortcut: '' },
      { icon: '⚙️', label: 'Settings',     shortcut: '⌘,' },
      { divider: true },
      { icon: '🚪', label: 'Sign Out',     shortcut: '', danger: true },
    ],
  },
]

// ── Colors / Avatars / Spinners / Layout ──────────────────────────────────
const colors = [
  { name: '--bg',      value: '#0f172a' }, { name: '--bg2',     value: '#1e293b' },
  { name: '--bg3',     value: '#334155' }, { name: '--accent',  value: '#6366f1' },
  { name: '--accent2', value: '#818cf8' }, { name: '--green',   value: '#10b981' },
  { name: '--red',     value: '#ef4444' }, { name: '--yellow',  value: '#f59e0b' },
  { name: '--text',    value: '#f1f5f9' }, { name: '--text2',   value: '#94a3b8' },
]
const avatars = [
  { initials:'AJ', color:'#6366f1', size:48, label:'Medium' },
  { initials:'BS', color:'#22c55e', size:36, label:'Small'  },
  { initials:'CW', color:'#f97316', size:56, label:'Large'  },
  { initials:'DK', color:'#ec4899', size:64, label:'XL'     },
]
const spinners = [
  { size:24, border:3, color:'var(--accent)',  label:'Small'  },
  { size:36, border:4, color:'var(--green)',   label:'Medium' },
  { size:48, border:5, color:'var(--accent2)', label:'Large'  },
]
const layoutUtils = [
  { cls:'.row',      desc:'display:flex; gap:12px; align-items:center; flex-wrap:wrap' },
  { cls:'.col',      desc:'display:flex; flex-direction:column; gap:8px' },
  { cls:'.mt / .mt2',desc:'margin-top: 20px / 12px' },
  { cls:'.divider',  desc:'1px horizontal rule — var(--bg3)' },
  { cls:'.label',    desc:'Form label — 0.85rem, bold, var(--text2)' },
  { cls:'.card',     desc:'Padded container with bg2, border, radius' },
  { cls:'.page-inner',desc:'Max-width 960px, centered, 40px padding' },
]

// ── LINE CHART ────────────────────────────────────────────────────────────
const lineDatasets = [
  { label: 'Revenue', color: '#6366f1', data: [45,72,58,89,67,95,78,82,60,91,74,88], labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] },
  { label: 'Users',   color: '#22c55e', data: [120,145,132,178,156,210,189,201,167,230,198,245], labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] },
  { label: 'Errors',  color: '#ef4444', data: [8,5,12,3,7,2,9,4,6,1,3,2], labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] },
]
const lineActive = ref(0)
const lineHover  = ref<number | null>(null)

const lineMax = computed(() => Math.max(...lineDatasets[lineActive.value].data))

function lCalcPoints(idx: number) {
  const { data, labels } = lineDatasets[idx]
  const max = Math.max(...data)
  const CX = 42, CY_BOT = 168, CW = 448, CH = 150
  return data.map((v, i) => ({
    x: CX + (i / (data.length - 1)) * CW,
    y: CY_BOT - (v / max) * CH,
    v, label: labels[i],
  }))
}

const linePoints = computed(() => lCalcPoints(lineActive.value))

const linePolyline = computed(() =>
  linePoints.value.map(p => `${p.x},${p.y}`).join(' ')
)
const lineArea = computed(() => {
  const pts = linePoints.value
  return `${pts.map(p => `${p.x},${p.y}`).join(' ')} ${pts[pts.length-1].x},168 ${pts[0].x},168`
})

// ── BAR CHART ─────────────────────────────────────────────────────────────
const barData = [
  { label:'Mon', v:58 }, { label:'Tue', v:92 }, { label:'Wed', v:74 },
  { label:'Thu', v:85 }, { label:'Fri', v:63 }, { label:'Sat', v:41 }, { label:'Sun', v:29 },
]
const barHover = ref<number | null>(null)
const barMax   = computed(() => Math.max(...barData.map(d => d.v)))
const barBars  = computed(() => {
  const n = barData.length, chartW = 450, chartH = 150
  const bw = (chartW / n) * 0.6
  const gap = (chartW / n) * 0.4
  const colors = ['#6366f1','#818cf8','#a5b4fc','#6366f1','#818cf8','#a5b4fc','#6366f1']
  const hovers = ['#4f46e5','#6d75e8','#8fa4f8','#4f46e5','#6d75e8','#8fa4f8','#4f46e5']
  return barData.map((d, i) => ({
    x: 40 + i * (chartW / n) + gap / 2,
    y: 10 + chartH - (d.v / barMax.value) * chartH,
    w: bw,
    h: (d.v / barMax.value) * chartH,
    ...d,
    color: colors[i], hoverColor: hovers[i],
  }))
})

// ── DONUT CHART ───────────────────────────────────────────────────────────
const donutData = [
  { label:'Vue',     value:35, color:'#22c55e' },
  { label:'React',   value:28, color:'#61dafb' },
  { label:'Angular', value:18, color:'#dd0031' },
  { label:'Svelte',  value:12, color:'#ff3e00' },
  { label:'Other',   value: 7, color:'#6366f1' },
]
const donutTotal = computed(() => donutData.reduce((s, d) => s + d.value, 0))
const donutSegments = computed(() => {
  const total = donutTotal.value, r = 60
  const circ = 2 * Math.PI * r
  let acc = 0
  return donutData.map(d => {
    const len = (d.value / total) * circ
    const seg = { ...d, dasharray: `${len} ${circ}`, offset: -acc }
    acc += len
    return seg
  })
})

// ── SPARKLINES ────────────────────────────────────────────────────────────
const sparklines = [
  { label:'Revenue', value:'$48,392', change:'12.4%', up:true,  data:[30,42,38,55,48,62,58,70,65,80] },
  { label:'Sessions', value:'12,840', change:'8.1%',  up:true,  data:[80,72,68,74,70,65,69,73,75,82] },
  { label:'Bounce',   value:'34.2%',  change:'3.5%',  up:false, data:[28,32,35,29,38,42,39,45,41,48] },
]
function sparkPoints(data: number[]) {
  const max = Math.max(...data), min = Math.min(...data)
  const range = max - min || 1
  return data.map((v, i) => `${(i / (data.length-1)) * 100},${28 - ((v-min)/range)*24}`).join(' ')
}

// ── GAUGE ─────────────────────────────────────────────────────────────────
const gauges = ref([
  { label:'Performance', value:78, c1:'#6366f1', c2:'#818cf8' },
  { label:'Reliability',  value:92, c1:'#10b981', c2:'#34d399' },
  { label:'Satisfaction', value:61, c1:'#f59e0b', c2:'#fcd34d' },
])

// ── HEATMAP ───────────────────────────────────────────────────────────────
const HEAT_COLORS = ['#1e293b','#1e3a5f','#1e4d9a','#2563eb','#60a5fa']
function heatColor(v: number) { return HEAT_COLORS[v] }

// 52 weeks × 7 days; seeded pseudo-random for consistency
const heatmapData = Array.from({ length: 52 * 7 }, (_, i) => {
  const seed = (i * 2654435761) >>> 0
  const chance = (seed % 100) / 100
  const value = chance < 0.42 ? 0 : chance < 0.6 ? 1 : chance < 0.75 ? 2 : chance < 0.88 ? 3 : 4
  return { value }
})

const heatMonths = [
  { label:'Jan', weeks:4 }, { label:'Feb', weeks:4 }, { label:'Mar', weeks:5 },
  { label:'Apr', weeks:4 }, { label:'May', weeks:4 }, { label:'Jun', weeks:5 },
  { label:'Jul', weeks:4 }, { label:'Aug', weeks:5 }, { label:'Sep', weeks:4 },
  { label:'Oct', weeks:4 }, { label:'Nov', weeks:5 }, { label:'Dec', weeks:4 },
]

// ── DATA TABLE ────────────────────────────────────────────────────────────
interface TableRow { id:number; name:string; dept:string; status:string; score:number; date:string }
const tableRows: TableRow[] = [
  { id:1, name:'Alice Johnson',  dept:'Engineering', status:'Active',   score:94, date:'Jan 15, 2024' },
  { id:2, name:'Bob Smith',      dept:'Design',      status:'Active',   score:87, date:'Feb 20, 2024' },
  { id:3, name:'Carol White',    dept:'Marketing',   status:'On Leave', score:72, date:'Jan 08, 2024' },
  { id:4, name:'David Brown',    dept:'Engineering', status:'Active',   score:91, date:'Mar 12, 2024' },
  { id:5, name:'Emma Davis',     dept:'HR',          status:'Inactive', score:65, date:'Dec 01, 2023' },
  { id:6, name:'Frank Miller',   dept:'Design',      status:'Active',   score:88, date:'Feb 28, 2024' },
  { id:7, name:'Grace Lee',      dept:'Engineering', status:'Active',   score:96, date:'Jan 22, 2024' },
  { id:8, name:'Henry Wilson',   dept:'Marketing',   status:'On Leave', score:78, date:'Mar 05, 2024' },
]
const tableSearch   = ref('')
const tableSelected = ref<number | null>(null)
const tableSort     = ref<{ col: string; dir: 'asc'|'desc' }>({ col: 'id', dir: 'asc' })
const tableCols = [
  { key:'id',     label:'#'       },
  { key:'name',   label:'Name'    },
  { key:'dept',   label:'Dept'    },
  { key:'status', label:'Status'  },
  { key:'score',  label:'Score'   },
  { key:'date',   label:'Date'    },
]

const filteredTable = computed(() => {
  const q = tableSearch.value.toLowerCase()
  let rows = q ? tableRows.filter(r =>
    r.name.toLowerCase().includes(q) || r.dept.toLowerCase().includes(q) || r.status.toLowerCase().includes(q)
  ) : [...tableRows]
  const { col, dir } = tableSort.value
  return rows.sort((a, b) => {
    const av = String((a as unknown as Record<string,unknown>)[col])
    const bv = String((b as unknown as Record<string,unknown>)[col])
    const cmp = av.localeCompare(bv, undefined, { numeric: true })
    return dir === 'asc' ? cmp : -cmp
  })
})

function sortTable(col: string) {
  if (tableSort.value.col === col) tableSort.value.dir = tableSort.value.dir === 'asc' ? 'desc' : 'asc'
  else tableSort.value = { col, dir: 'asc' }
}

// ── SPREADSHEET GRID ──────────────────────────────────────────────────────
const gridData = ref([
  ['Product',   'Q1',   'Q2',   'Q3',   'Q4'  ],
  ['Widgets',   '1240', '1850', '2100', '2480' ],
  ['Gadgets',   '890',  '1200', '1350', '1620' ],
  ['Gizmos',    '456',  '678',  '890',  '1100' ],
  ['Doohickeys','234',  '345',  '456',  '567'  ],
  ['Whatsits',  '67',   '89',   '112',  '145'  ],
  ['TOTAL',     '2887', '4162', '4908', '5912' ],
])
const gridEditing  = ref<[number,number] | null>(null)
const gridSelected = ref<[number,number] | null>(null)
const gridEditVal  = ref('')
const gridInputRef = ref<HTMLInputElement | null>(null)

function selectCell(r: number, c: number) {
  gridSelected.value = [r, c]
}
function startEdit(r: number, c: number) {
  gridEditing.value = [r, c]; gridSelected.value = [r, c]
  gridEditVal.value = gridData.value[r][c]
  nextTick(() => (gridInputRef.value as HTMLInputElement | null)?.focus())
}
function commitGrid() {
  if (gridEditing.value) {
    const [r, c] = gridEditing.value
    gridData.value[r][c] = gridEditVal.value
    gridEditing.value = null
  }
}

// ── PAGINATION ────────────────────────────────────────────────────────────
const pageTotal   = ref(148)
const pageSize    = ref(10)
const pageCurrent = ref(1)
const pageCount   = computed(() => Math.ceil(pageTotal.value / pageSize.value))
const pageFrom    = computed(() => (pageCurrent.value - 1) * pageSize.value + 1)
const pageTo      = computed(() => Math.min(pageCurrent.value * pageSize.value, pageTotal.value))

const pageRange = computed(() => {
  const total = pageCount.value, cur = pageCurrent.value
  const range: (number | '…')[] = []
  for (let p = 1; p <= total; p++) {
    if (p === 1 || p === total || (p >= cur - 1 && p <= cur + 1)) range.push(p)
    else if (range[range.length - 1] !== '…') range.push('…')
  }
  return range
})

// ── BREADCRUMB ────────────────────────────────────────────────────────────
const breadcrumbs    = ref(['Home', 'Projects', 'Vue 3'])
const breadcrumbExtend = ['Components', 'Storybook', 'Charts', 'Data']

// ── STEPPER ───────────────────────────────────────────────────────────────
const stepperSteps   = ['Account', 'Profile', 'Settings', 'Review', 'Done']
const stepperCurrent = ref(1)

// ── TOAST ─────────────────────────────────────────────────────────────────
interface Toast { id: number; type: string; message: string }
const toasts = ref<Toast[]>([])
let toastId  = 0
function addToast(type: string, message: string) {
  const id = ++toastId
  toasts.value.push({ id, type, message })
  setTimeout(() => removeToast(id), 3500)
}
function removeToast(id: number) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

// ── TIMELINE ──────────────────────────────────────────────────────────────
const timelineEvents = [
  { icon:'🚀', title:'Project Launched',   desc:'Initial release deployed to production.',        date:'Jan 10, 2024', color:'#6366f1', status:'Done',       badge:'blue'   },
  { icon:'🎨', title:'UI Redesign',        desc:'New design system and component library added.',  date:'Feb 14, 2024', color:'#ec4899', status:'Done',       badge:'blue'   },
  { icon:'⚡', title:'Performance Update', desc:'Bundle size reduced by 42%, load time halved.',   date:'Mar 05, 2024', color:'#f59e0b', status:'Done',       badge:'blue'   },
  { icon:'🔒', title:'Security Audit',     desc:'Third-party security review in progress.',        date:'Mar 22, 2024', color:'#ef4444', status:'In Progress', badge:'yellow' },
  { icon:'📦', title:'v2.0 Release',       desc:'Major version with 50 new components planned.',   date:'Apr 15, 2024', color:'#10b981', status:'Planned',    badge:'green'  },
]

// ── KANBAN ────────────────────────────────────────────────────────────────
const kanbanCols = [
  { id:'todo',  label:'To Do',      color:'#94a3b8' },
  { id:'doing', label:'In Progress', color:'#6366f1' },
  { id:'done',  label:'Done',        color:'#22c55e' },
]
const kanbanCards = ref([
  { id:1, text:'Design new logo',       col:'todo',  pri:'yellow', priLabel:'Med' },
  { id:2, text:'Fix auth bug',          col:'doing', pri:'red',    priLabel:'High' },
  { id:3, text:'Write unit tests',      col:'todo',  pri:'blue',   priLabel:'Low' },
  { id:4, text:'Update docs',           col:'done',  pri:'green',  priLabel:'Done' },
  { id:5, text:'Code review PR #42',    col:'doing', pri:'yellow', priLabel:'Med' },
  { id:6, text:'Deploy to staging',     col:'todo',  pri:'red',    priLabel:'High' },
  { id:7, text:'Refactor API layer',    col:'done',  pri:'green',  priLabel:'Done' },
])
let draggingId = -1
function cardsByCol(col: string) { return kanbanCards.value.filter(c => c.col === col) }
function dragStart(e: DragEvent, id: number) { draggingId = id }
function dropCard(_e: DragEvent, col: string) {
  const card = kanbanCards.value.find(c => c.id === draggingId)
  if (card) card.col = col
}

// ── CODE SNIPPETS ─────────────────────────────────────────────────────────
const typographyCode = `<h1>Heading 1 — 2.5rem / 800</h1>
<h2>Heading 2 — 1.8rem / 700</h2>
<p>Body text — 0.95rem</p>
<p style="color:var(--text2)">Muted — var(--text2)</p>
<p style="font-family:monospace">Monospace</p>`

const layoutCode = `<div class="row">…</div>
<div class="divider" />
<label class="label">Field</label>
<input class="input mt2" />`

const btnVariantsCode = `<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-danger">Danger</button>
<button class="btn btn-warn">Warning</button>`

const btnSizesCode = `<button class="btn btn-primary">Default</button>
<button class="btn btn-primary btn-sm">Small (.btn-sm)</button>`

const btnDisabledCode = `<button class="btn btn-primary" disabled>Disabled</button>`

const inputTextCode = `<label class="label">Field</label>
<input class="input" placeholder="…" />
<textarea class="input" />
<select class="input"><option>…</option></select>`

const inputCheckCode = `<input type="range" style="accent-color:var(--accent)" />
<label class="checkbox-row">
  <input type="checkbox" v-model="val"
    style="accent-color:var(--accent)" /> Label
</label>`

const badgeCode = `<span class="badge badge-blue">Blue</span>
<span class="badge badge-green">Green</span>
<span class="badge badge-yellow">Yellow</span>
<span class="badge badge-red">Red</span>`

const alertCode = `<div class="msg msg-success">✓ Success</div>
<div class="msg msg-error">✗ Error</div>
<div class="msg msg-info">ℹ Info</div>`

const cardCode = `<div class="card">
  <h3>Title</h3>
  <p>Body</p>
  <button class="btn btn-primary btn-sm">Action</button>
</div>`

const statGridCode = `<div class="stat-grid">
  <div class="stat-box">
    <div class="val" style="color:var(--green)">$12,400</div>
    <div class="lbl">Revenue</div>
  </div>
</div>`

const progressCode = `<div class="progress-bar">
  <div class="progress-fill" :style="{ width: pct + '%' }" />
</div>`

const toggleCode = `<label>
  <input type="checkbox" v-model="on" style="display:none" />
  <div class="sb-toggle" :class="{ on }">
    <div class="sb-toggle-thumb" />
  </div>
</label>`

const tabsCode = `<div class="sb-tabs">
  <button v-for="t in tabs" :key="t"
    class="sb-tab" :class="{ active: active===t }"
    @click="active=t">{{ t }}</button>
</div>`

const avatarCode = `<div style="width:48px;height:48px;border-radius:50%;
  background:var(--accent);display:flex;align-items:center;
  justify-content:center;font-weight:700;color:#fff">AJ</div>`

const spinnerCode = `<div style="width:36px;height:36px;border-radius:50%;
  border:4px solid rgba(99,102,241,0.2);
  border-top-color:var(--accent);
  animation:spin 0.75s linear infinite" />`

const tooltipCode = `<!-- CSS-only tooltip: .sb-tip[data-tip] -->
<span class="sb-tip" data-tip="Default dark tooltip">
  <button class="btn btn-secondary">Default</button>
</span>
<span class="sb-tip sb-tip-success" data-tip="✓ Saved">
  <button class="btn btn-success btn-sm">Success</button>
</span>
<span class="sb-tip sb-tip-error" data-tip="✗ Error">
  <button class="btn btn-danger btn-sm">Error</button>
</span>
<span class="sb-tip sb-tip-warn" data-tip="⚠ Warning">
  <button class="btn btn-warn btn-sm">Warning</button>
</span>

/* CSS */
.sb-tip { position:relative; display:inline-flex; }
.sb-tip::after {
  content: attr(data-tip);
  position: absolute; bottom: calc(100% + 8px); left: 50%;
  transform: translateX(-50%);
  background: #1e293b; color: var(--text);
  padding: 6px 10px; border-radius: 6px;
  font-size: .78rem; white-space: nowrap;
  opacity: 0; transition: opacity .15s; pointer-events: none;
}
.sb-tip:hover::after { opacity: 1; }
.sb-tip-success::after { background:#065f46; color:#a7f3d0; }
.sb-tip-error::after   { background:#7f1d1d; color:#fecaca; }
.sb-tip-warn::after    { background:#78350f; color:#fde68a; }`

const tooltipVueCode = `<!-- Vue-driven tooltip with arrow + pin -->
<div style="position:relative; display:inline-flex">
  <button
    @mouseenter="tipHover = i"
    @mouseleave="tipHover = null"
    @click="tipPin = tipPin===i ? null : i">
    {{ label }}
  </button>
  <transition name="sb-tip-fade">
    <div v-if="tipHover===i || tipPin===i" class="sb-tip-bubble">
      {{ text }}
      <div class="sb-tip-arrow" />
    </div>
  </transition>
</div>

/* CSS */
.sb-tip-bubble {
  position: absolute; bottom: calc(100% + 10px);
  left: 50%; transform: translateX(-50%);
  background: #1e293b; padding: 8px 12px;
  border-radius: 8px; white-space: nowrap;
  border: 1px solid var(--bg3); z-index: 50;
}
.sb-tip-arrow {
  position: absolute; bottom: -5px; left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 8px; height: 8px; background: #1e293b;
  border-right: 1px solid var(--bg3);
  border-bottom: 1px solid var(--bg3);
}
.sb-tip-fade-enter-active,
.sb-tip-fade-leave-active { transition: opacity .15s; }
.sb-tip-fade-enter-from,
.sb-tip-fade-leave-to { opacity: 0; }`

const skeletonCode = `<div class="sb-skeleton"
  style="height:14px;width:60%;border-radius:6px" />`

const modalPreviewCode = `<!-- Modal dialog structure (inline preview) -->
<div style="background:var(--bg2);border:1px solid var(--bg3);
  border-radius:14px;padding:24px 28px;width:380px">
  <div style="display:flex;justify-content:space-between;margin-bottom:12px">
    <h3>Delete Project?</h3>
    <button @click="close">✕</button>
  </div>
  <p style="color:var(--text2);line-height:1.6;margin-bottom:20px">
    This action cannot be undone.
  </p>
  <div style="display:flex;gap:8px;justify-content:flex-end">
    <button class="btn btn-secondary btn-sm" @click="close">Cancel</button>
    <button class="btn btn-danger btn-sm" @click="confirm">Delete</button>
  </div>
</div>`

const modalCode = `<!-- Full modal with backdrop (Teleport) -->
<Teleport to="body">
  <div v-if="open"
    style="position:fixed;inset:0;background:rgba(0,0,0,.6);
      display:flex;align-items:center;justify-content:center;z-index:1000"
    @click.self="open=false">
    <div style="background:var(--bg2);border:1px solid var(--bg3);
      border-radius:14px;padding:28px;width:400px;max-width:90vw">
      <h3 style="margin-bottom:10px">Modal Title</h3>
      <p style="color:var(--text2);margin-bottom:20px">Content here.</p>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn btn-secondary" @click="open=false">Cancel</button>
        <button class="btn btn-primary"   @click="open=false">Confirm</button>
      </div>
    </div>
  </div>
</Teleport>`

const flashcardCode = `<div class="flashcard" :class="{ answer: flipped }"
  @click="flipped = !flipped">{{ flipped ? answer : question }}</div>`

const starsCode = `<div class="stars">
  <span v-for="i in 5" :key="i"
    class="star" :class="{ lit: i <= rating }"
    @click="rating = i">★</span>
</div>`

const chipsCode = `<span v-for="chip in chips" :key="chip"
  style="padding:4px 12px;border-radius:999px;background:var(--accent);color:#fff">
  {{ chip }}
  <button @click="remove(chip)">✕</button>
</span>`

const kbdCode = `Press <kbd>Ctrl</kbd> + <kbd>K</kbd>`

const lineChartCode = `<!-- SVG line chart with area fill & tooltips -->
<svg viewBox="0 0 500 195" style="width:100%">
  <defs>
    <linearGradient id="lg-line" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="var(--accent)" stop-opacity="0.3" />
      <stop offset="100%" stop-color="var(--accent)" stop-opacity="0.02" />
    </linearGradient>
  </defs>
  <polygon :points="areaPoints" fill="url(#lg-line)" />
  <polyline :points="linePoints" fill="none"
    stroke="var(--accent)" stroke-width="2.5" />
  <circle v-for="(pt, i) in points" :key="i"
    :cx="pt.x" :cy="pt.y" r="4" fill="var(--accent)"
    @mouseenter="hover=i" @mouseleave="hover=null" />
</svg>`

const barChartCode = `<!-- SVG vertical bar chart -->
<svg viewBox="0 0 500 200" style="width:100%">
  <rect v-for="(bar, i) in bars" :key="i"
    :x="bar.x" :y="bar.y" :width="bar.w" :height="bar.h"
    :fill="hover===i ? bar.hoverColor : bar.color" rx="4" />
  <text v-for="(bar, i) in bars" :key="'l'+i"
    :x="bar.x + bar.w/2" :y="196"
    text-anchor="middle" font-size="10" fill="#64748b">{{ bar.label }}</text>
</svg>`

const donutChartCode = `<!-- Donut chart via stroke-dasharray on SVG circles -->
<svg viewBox="0 0 160 160">
  <g transform="rotate(-90 80 80)">
    <circle v-for="seg in segments" :key="seg.label"
      cx="80" cy="80" r="60" fill="none"
      :stroke="seg.color" stroke-width="28"
      :stroke-dasharray="seg.dasharray"
      :stroke-dashoffset="seg.offset" />
  </g>
</svg>

// dasharray: \`\${len} \${circumference}\`
// Accumulate offsets: seg.offset = -accumulatedLength`

const sparklineCode = `<svg viewBox="0 0 100 30" style="width:100px;height:30px">
  <polyline :points="sparkPoints(data)"
    fill="none" stroke="var(--green)" stroke-width="2" />
</svg>

// sparkPoints(data):
//   map((v,i) => \`\${(i/(n-1))*100},\${28-((v-min)/range)*24}\`).join(' ')`

const gaugeCode = `<!-- Semicircular SVG gauge -->
<svg viewBox="0 0 200 115">
  <!-- track (full arc) -->
  <path d="M 20,100 A 80,80 0 0,1 180,100"
    fill="none" stroke="#334155"
    stroke-width="16" stroke-linecap="round" />
  <!-- fill: arc length = PI * r = 251.33 -->
  <path d="M 20,100 A 80,80 0 0,1 180,100"
    fill="none" stroke="var(--accent)"
    stroke-width="16" stroke-linecap="round"
    :stroke-dasharray="\`\${(value/100)*251.33} 251.33\`" />
  <text x="100" y="88" text-anchor="middle"
    font-size="26" font-weight="800" fill="#f1f5f9">{{ value }}%</text>
</svg>`

const heatmapCode = `<!-- GitHub-style heatmap: 52w × 7d grid -->
<div style="display:grid;
  grid-template-rows:repeat(7,12px);
  grid-auto-flow:column;
  grid-auto-columns:12px;gap:2px">
  <div v-for="cell in heatmapData" :key="cell.id"
    style="border-radius:2px"
    :style="{ background: heatColor(cell.value) }" />
</div>`

const dataTableCode = `<table class="sb-table">
  <thead>
    <tr>
      <th v-for="col in cols" :key="col.key"
        @click="sortBy(col.key)">{{ col.label }}</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="row in sortedRows" :key="row.id">
      <td>{{ row.name }}</td>
      <td><span class="badge badge-green">{{ row.status }}</span></td>
    </tr>
  </tbody>
</table>`

const dataGridCode = `<!-- Editable spreadsheet grid -->
<table class="sb-grid">
  <thead>
    <tr>
      <th />
      <th v-for="(_, ci) in row" :key="ci">
        {{ String.fromCharCode(65+ci) }}
      </th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(row, ri) in data" :key="ri">
      <td class="sb-grid-rownum">{{ ri+1 }}</td>
      <td v-for="(cell, ci) in row" :key="ci">
        <input v-if="editing?.[0]===ri && editing?.[1]===ci"
          class="sb-grid-input" v-model="editVal"
          @keydown.enter="commit" @blur="commit" />
        <div v-else class="sb-grid-cell"
          @dblclick="startEdit(ri, ci)">{{ cell }}</div>
      </td>
    </tr>
  </tbody>
</table>`

const paginationCode = `<div class="sb-pagination">
  <button class="sb-page-btn" :disabled="page===1" @click="page--">‹</button>
  <button v-for="p in pageRange" :key="p"
    class="sb-page-btn" :class="{ active: p===page }"
    @click="page = p">{{ p }}</button>
  <button class="sb-page-btn" :disabled="page===last" @click="page++">›</button>
</div>`

const breadcrumbCode = `<nav class="sb-breadcrumb">
  <span v-for="(crumb, i) in crumbs" :key="crumb">
    <button class="sb-crumb-btn"
      :class="{ active: i === crumbs.length-1 }"
      @click="crumbs = crumbs.slice(0, i+1)">{{ crumb }}</button>
    <span v-if="i < crumbs.length-1" class="sb-crumb-sep">/</span>
  </span>
</nav>`

const stepperCode = `<div class="sb-stepper">
  <template v-for="(step, i) in steps" :key="step">
    <div class="sb-step"
      :class="{ done: i < current, active: i === current }">
      <div class="sb-step-circle">{{ i < current ? '✓' : i+1 }}</div>
      <div class="sb-step-label">{{ step }}</div>
    </div>
    <div v-if="i < steps.length-1" class="sb-step-line"
      :class="{ done: i < current }" />
  </template>
</div>`

const toastPreviewCode = `<!-- All 4 toast variants shown statically -->
<div class="sb-toast sb-toast-success">✓ File saved successfully!</div>
<div class="sb-toast sb-toast-error">✗ Upload failed. Please retry.</div>
<div class="sb-toast sb-toast-info">ℹ New version v2.1 available.</div>
<div class="sb-toast sb-toast-warn">⚠ Storage at 89% capacity.</div>`

const toastCode = `// Add a toast:
function addToast(type, message) {
  const id = ++toastId
  toasts.push({ id, type, message })
  setTimeout(() => removeToast(id), 3500)
}

// Render (teleported to body):
<Teleport to="body">
  <div class="sb-toast-stack">
    <div v-for="t in toasts" :key="t.id"
      class="sb-toast" :class="\`sb-toast-\${t.type}\`">
      {{ t.message }}
    </div>
  </div>
</Teleport>`

const dropdownCode = `<!-- Dropdown menu -->
<div style="position:relative">
  <button @click="open = !open">Actions ▼</button>
  <transition name="sb-tip-fade">
    <div v-if="open" class="sb-dropdown">
      <button class="sb-dropdown-item" @click="open=false">
        <span>✏️</span><span>Edit</span><span class="sb-dropdown-kbd">⌘E</span>
      </button>
      <div class="sb-dropdown-divider" />
      <button class="sb-dropdown-item danger" @click="open=false">
        <span>🗑</span><span>Delete</span>
      </button>
    </div>
  </transition>
</div>

/* CSS */
.sb-dropdown {
  position: absolute; top: calc(100% + 6px); left: 0;
  background: var(--bg2); border: 1px solid var(--bg3);
  border-radius: 10px; padding: 6px; min-width: 200px;
  box-shadow: 0 8px 24px rgba(0,0,0,.4); z-index: 100;
}
.sb-dropdown-item {
  width: 100%; display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; border-radius: 6px;
  background: none; border: none; color: var(--text);
  font-size: .88rem; cursor: pointer; text-align: left;
}
.sb-dropdown-item:hover  { background: var(--bg3); }
.sb-dropdown-item.danger { color: var(--red); }
.sb-dropdown-item.active { background: rgba(99,102,241,.15); color: var(--accent2); }`

const dropdownSelectCode = `<!-- Select/picker dropdown -->
<div style="position:relative">
  <button @click="open = !open" style="min-width:180px">
    {{ selected || 'Select…' }} ▼
  </button>
  <transition name="sb-tip-fade">
    <div v-if="open" class="sb-dropdown">
      <button v-for="opt in options" :key="opt"
        class="sb-dropdown-item" :class="{ active: selected===opt }"
        @click="selected=opt; open=false">
        <span>{{ selected===opt ? '✓' : '  ' }}</span>
        <span>{{ opt }}</span>
      </button>
    </div>
  </transition>
</div>`

const timelineCode = `<div class="sb-timeline">
  <div v-for="ev in events" :key="ev.title"
    class="sb-timeline-item">
    <div class="sb-timeline-connector">
      <div class="sb-timeline-icon"
        :style="{ background: ev.color }">{{ ev.icon }}</div>
      <div class="sb-timeline-line" />
    </div>
    <div class="sb-timeline-body">
      <span class="badge badge-blue">{{ ev.status }}</span>
      <div>{{ ev.title }}</div>
      <div>{{ ev.date }}</div>
    </div>
  </div>
</div>`

const kanbanCode = `<!-- Drag-and-drop Kanban -->
<div class="kanban">
  <div v-for="col in cols" :key="col.id" class="kanban-col"
    @dragover.prevent @drop="drop($event, col.id)">
    <h3>{{ col.label }}</h3>
    <div v-for="card in cardsByCol(col.id)" :key="card.id"
      class="kanban-card" draggable="true"
      @dragstart="dragId = card.id">{{ card.text }}</div>
  </div>
</div>`

// ══ NEW STATE ══════════════════════════════════════════════════════════════

// ── Foundation ────────────────────────────────────────────────────────────
const spacingScale = [4,8,12,16,20,24,32,40,48,64,80,96].map(px => ({ name: `${px/4}`, px }))
const shadowLevels = [
  { name:'None',  value:'none',                                         label:'0px' },
  { name:'sm',    value:'0 1px 3px rgba(0,0,0,.3)',                     label:'0 1px 3px' },
  { name:'md',    value:'0 4px 12px rgba(0,0,0,.4)',                    label:'0 4px 12px' },
  { name:'lg',    value:'0 8px 24px rgba(0,0,0,.5)',                    label:'0 8px 24px' },
  { name:'xl',    value:'0 16px 48px rgba(0,0,0,.55)',                  label:'0 16px 48px' },
  { name:'2xl',   value:'0 24px 64px rgba(0,0,0,.6),0 4px 8px rgba(0,0,0,.3)', label:'compound' },
]
const borderRadii = [
  { name:'none',  value:'0' }, { name:'sm',    value:'4px' }, { name:'md',    value:'8px' },
  { name:'lg',    value:'12px' }, { name:'xl',    value:'16px' }, { name:'2xl',   value:'24px' }, { name:'full',  value:'9999px' },
]
const spacingCode  = `<!-- Base-4 spacing tokens -->
<div style="margin-top: 16px"> <!-- mt-4 --></div>`
const shadowCode   = `.shadow-sm  { box-shadow: 0 1px 3px rgba(0,0,0,.3); }
.shadow-lg  { box-shadow: 0 8px 24px rgba(0,0,0,.5); }`
const bordersCode  = `.rounded-sm   { border-radius: 4px; }
.rounded-full { border-radius: 9999px; }`

// ── Controls ──────────────────────────────────────────────────────────────
const cbItems = ref([
  { label: 'Vue 3 Composition API', checked: true,  badge: 'badge-green',  tag: 'Core'     },
  { label: 'TypeScript Support',    checked: true,  badge: 'badge-blue',   tag: 'Type-safe'},
  { label: 'Vite Build Tool',       checked: false, badge: 'badge-yellow', tag: 'Build'    },
  { label: 'Vue Router',            checked: false, badge: 'badge-blue',   tag: 'Routing'  },
  { label: 'Pinia State',           checked: false, badge: 'badge-green',  tag: 'State'    },
])
const cbAll = computed(() => cbItems.value.every(i => i.checked))
const cbIndeterminate = computed(() => cbItems.value.some(i => i.checked) && !cbAll.value)
function toggleAllCb() { const next = !cbAll.value; cbItems.value.forEach(i => i.checked = next) }

const radioOptions = [
  { value: 'free',  label: 'Free',  desc: '$0 / month'  },
  { value: 'pro',   label: 'Pro',   desc: '$12 / month' },
  { value: 'team',  label: 'Team',  desc: '$29 / month' },
]
const radioSelected = ref('pro')

const numSteppers = ref([
  { label: 'Quantity', val: 1,   min: 1,  max: 10,  step: 1  },
  { label: 'Volume',   val: 50,  min: 0,  max: 100, step: 5  },
  { label: 'Zoom %',   val: 100, min: 25, max: 400, step: 25 },
])

const pickedColor  = ref('#6366f1')
const presetColors = ['#6366f1','#22c55e','#ef4444','#f59e0b','#06b6d4','#ec4899','#8b5cf6','#f97316']

const searchQuery   = ref('')
const searchPool    = ['Vue 3','React','Svelte','Angular','SolidJS','Nuxt','Next.js','Astro','Remix','Qwik']
const searchResults = computed(() =>
  searchQuery.value ? searchPool.filter(s => s.toLowerCase().includes(searchQuery.value.toLowerCase())) : searchPool
)

const rangeSliders = ref([
  { label: 'Volume',      val: 72, min: 0,  max: 100, step: 1,   unit: '%'  },
  { label: 'Temperature', val: 22, min: 15, max: 35,  step: 0.5, unit: '°C' },
  { label: 'Brightness',  val: 60, min: 0,  max: 100, step: 10,  unit: '%'  },
])

const comboQuery    = ref('')
const comboOpen     = ref(false)
const comboSelected = ref('')
const comboPool     = ['Australia','Brazil','Canada','Denmark','Egypt','France','Germany','Hungary','India','Japan','Kenya','Luxembourg','Mexico','Norway','Poland']
const comboFiltered = computed(() =>
  comboPool.filter(c => c.toLowerCase().includes(comboQuery.value.toLowerCase())).slice(0, 8)
)
function comboBlur() { window.setTimeout(() => comboOpen.value = false, 150) }
function copyIcon(emoji: string) {
  navigator.clipboard.writeText(emoji).then(() => { copiedIcon.value = emoji; window.setTimeout(() => copiedIcon.value = '', 1500) })
}
function copyCodeBlock() { cbCopied.value = true; window.setTimeout(() => cbCopied.value = false, 1500) }
function triggerLoadBtn() { loadingBtn.value = true; window.setTimeout(() => loadingBtn.value = false, 2000) }

const checkboxCode     = `<input type="checkbox" :indeterminate.prop="indeterminate" :checked="allChecked" />`
const radioCode        = `<label v-for="opt in options"><input type="radio" v-model="sel" :value="opt.value" /></label>`
const stepperInputCode = `<button @click="val = Math.max(min, val-step)">−</button>
<span>{{ val }}</span>
<button @click="val = Math.min(max, val+step)">+</button>`
const colorInputCode   = `<input type="color" v-model="color" class="sb-color-picker" />`
const searchInputCode  = `<input v-model="query" placeholder="Search…" />
<button v-if="query" @click="query=''">✕</button>`
const rangeSliderCode  = `<input type="range" v-model.number="val" :min="min" :max="max" class="sb-range" />`
const comboboxCode     = `<input v-model="query" @focus="open=true" @blur="setTimeout(()=>open=false,150)" />
<div v-if="open"><button v-for="opt in filtered" @mousedown.prevent="select(opt)">{{ opt }}</button></div>`

// ── Display extras ─────────────────────────────────────────────────────────
const emptyStates = [
  { icon:'📭', title:'No messages',  desc:'Your inbox is empty. Start a conversation.',   action:'Compose' },
  { icon:'🔍', title:'No results',   desc:'Try a different search term or clear filters.', action:''        },
  { icon:'📁', title:'No files yet', desc:'Upload your first file to get started.',         action:'Upload'  },
]
const listItems = [
  { icon:'🏠', title:'Dashboard',  desc:'Overview of your workspace stats',    badge:'badge-green',  tag:'Active'  },
  { icon:'📊', title:'Analytics',  desc:'Traffic, conversions, and funnels',   badge:'badge-blue',   tag:'New'     },
  { icon:'⚙️', title:'Settings',   desc:'Manage preferences and integrations', badge:'badge-yellow', tag:'Updated' },
  { icon:'🔒', title:'Security',   desc:'2FA, sessions, and audit logs',       badge:'badge-red',    tag:'Alert'   },
]
const cbCopied    = ref(false)
const accordionItems = [
  { q:'What is Vue 3?',               a:'Vue 3 is the latest major version of Vue.js featuring Composition API, improved TypeScript support, and better performance via Proxy-based reactivity.' },
  { q:'How does reactivity work?',    a:'Vue 3 uses a Proxy-based reactivity system. Accessing a reactive property in a computed or effect tracks the dependency and re-runs on change.' },
  { q:'What is the Composition API?', a:'The Composition API lets you compose component logic using ref(), reactive(), computed(), watch(), and lifecycle hooks in a flexible, reusable way.' },
  { q:'When should I use Pinia?',     a:'Use Pinia for state that needs to be shared across many unrelated components or that must persist between route navigations.' },
]
const accordionOpen = ref<number|null>(0)
const banners = [
  { icon:'💡', title:'Tip',     desc:'Use keyboard shortcuts for a faster workflow.',        bg:'rgba(99,102,241,.1)',  border:'#6366f1' },
  { icon:'✅', title:'Success', desc:'Your changes have been published and are now live.',    bg:'rgba(16,185,129,.1)',  border:'#10b981' },
  { icon:'⚠️', title:'Warning', desc:'Free plan usage at 87%. Upgrade to avoid interruption.',bg:'rgba(245,158,11,.1)', border:'#f59e0b' },
  { icon:'🚫', title:'Error',   desc:'Failed to save. Check your connection and try again.', bg:'rgba(239,68,68,.1)',   border:'#ef4444' },
]
const iconSet = [
  {emoji:'⚡',label:'bolt'},{emoji:'🔥',label:'fire'},{emoji:'💎',label:'gem'},{emoji:'🚀',label:'rocket'},
  {emoji:'🎯',label:'target'},{emoji:'✨',label:'sparkle'},{emoji:'🌈',label:'rainbow'},{emoji:'🔮',label:'crystal'},
  {emoji:'🏆',label:'trophy'},{emoji:'💡',label:'idea'},{emoji:'🎨',label:'palette'},{emoji:'🔑',label:'key'},
  {emoji:'🌊',label:'wave'},{emoji:'🌟',label:'star'},{emoji:'🦋',label:'butterfly'},{emoji:'🎭',label:'masks'},
  {emoji:'🔬',label:'lab'},{emoji:'🧬',label:'dna'},{emoji:'🌿',label:'herb'},{emoji:'🦄',label:'unicorn'},
]
const copiedIcon  = ref('')
const meters = [
  { label:'Vue',        value:88, color:'#22c55e' },
  { label:'TypeScript', value:75, color:'#3b82f6' },
  { label:'CSS',        value:92, color:'#f59e0b' },
  { label:'Rust',       value:42, color:'#ef4444' },
]
const meterSignal = ref(3)
const statusUsers = [
  { name:'Alice J.', initials:'AJ', color:'#6366f1', status:'online',  statusColor:'#22c55e' },
  { name:'Bob S.',   initials:'BS', color:'#22c55e', status:'busy',    statusColor:'#ef4444' },
  { name:'Carol W.', initials:'CW', color:'#f97316', status:'away',    statusColor:'#f59e0b' },
  { name:'David B.', initials:'DB', color:'#ec4899', status:'offline', statusColor:'#475569' },
]
const dividersCode    = `<div class="divider" />`
const emptyStateCode  = `<div style="text-align:center;padding:40px">
  <span style="font-size:3rem">📭</span>
  <h3>No messages</h3>
  <button class="btn btn-primary">Compose</button>
</div>`
const listItemsCode   = `<div v-for="item in items" :key="item.id" class="list-item">{{ item.title }}</div>`
const codeBlockCode   = `<pre><code>{{ highlighted }}</code></pre>`
const accordionCode   = `<button @click="open = open===i ? null : i">{{ title }} ▼</button>
<div v-if="open===i">{{ content }}</div>`
const bannerCode      = `<div :style="{ background: color+'22', borderLeft: '4px solid '+color }">{{ message }}</div>`
const iconGridCode    = `<button v-for="ic in icons" @click="copy(ic.emoji)">{{ ic.emoji }}</button>`
const meterCode       = `<div style="height:10px;background:var(--bg3);border-radius:999px">
  <div :style="{ width: value+'%', background: color }" />
</div>`
const statusIndCode   = `<div style="position:relative">
  <div class="avatar">{{ initials }}</div>
  <div :style="{ background: statusColor }" class="status-dot" />
</div>`

// ── Charts extras ─────────────────────────────────────────────────────────
const areaRaw = [[30,45,38,60,52,70,65,82,75,90],[20,30,25,40,33,50,45,62,55,70]]
const areaPoints1 = computed(() => {
  const d=areaRaw[0], n=d.length, W=450, H=150, X0=40, YB=170, max=Math.max(...d)
  const pts = d.map((v,i) => `${X0+(i/(n-1))*W},${YB-(v/max)*H}`)
  return [...pts, `${X0+W},${YB}`, `${X0},${YB}`].join(' ')
})
const areaPoints2 = computed(() => {
  const d=areaRaw[1], n=d.length, W=450, H=150, X0=40, YB=170, max=Math.max(...areaRaw[0])
  const pts = d.map((v,i) => `${X0+(i/(n-1))*W},${YB-(v/max)*H}`)
  return [...pts, `${X0+W},${YB}`, `${X0},${YB}`].join(' ')
})
const areaLine1 = computed(() => {
  const d=areaRaw[0], n=d.length, W=450, H=150, X0=40, YB=170, max=Math.max(...d)
  return d.map((v,i) => `${X0+(i/(n-1))*W},${YB-(v/max)*H}`).join(' ')
})
const areaLine2 = computed(() => {
  const d=areaRaw[1], n=d.length, W=450, H=150, X0=40, YB=170, max=Math.max(...areaRaw[0])
  return d.map((v,i) => `${X0+(i/(n-1))*W},${YB-(v/max)*H}`).join(' ')
})
const hbarData = [
  { label:'Vue',     v:88, color:'#22c55e' }, { label:'React',   v:72, color:'#61dafb' },
  { label:'Angular', v:58, color:'#dd0031' }, { label:'Svelte',  v:45, color:'#ff3e00' },
  { label:'SolidJS', v:32, color:'#2c4f7c' }, { label:'Qwik',    v:20, color:'#ac7ef4' },
]
const hbarMax = computed(() => Math.max(...hbarData.map(d => d.v)))
const pieData = [
  { label:'Vue', value:35, color:'#22c55e' }, { label:'React',   value:28, color:'#61dafb' },
  { label:'Angular', value:18, color:'#dd0031' }, { label:'Svelte', value:12, color:'#ff3e00' }, { label:'Other', value:7, color:'#6366f1' },
]
const pieHover = ref<number|null>(null)
const pieSegments = computed(() => {
  let cum = 0
  return pieData.map(d => {
    const start = cum*Math.PI*2/100 - Math.PI/2, end = (cum+d.value)*Math.PI*2/100 - Math.PI/2
    const x1=Math.cos(start),y1=Math.sin(start),x2=Math.cos(end),y2=Math.sin(end)
    const path = `M 0 0 L ${x1} ${y1} A 1 1 0 ${d.value>50?1:0} 1 ${x2} ${y2} Z`
    cum += d.value; return { ...d, d: path }
  })
})
const scatterPts = Array.from({length:18}, (_,i) => {
  const s=(i*1664525+1013904223)>>>0
  return { x:50+(s%400), y:20+((s>>8)%130), r:4+((s>>16)%8), color:['#6366f1','#22c55e','#ef4444','#f59e0b'][(s>>24)%4], label:`P${i+1}` }
})
const scatterHover = ref<number|null>(null)
const radarAxes   = ['Speed','Reliability','Usability','Features','Security','Performance']
const radarSeries = [[0.9,0.75,0.85,0.7,0.8,0.88],[0.6,0.9,0.7,0.95,0.65,0.72]]
function radarGrid(level: number) {
  const n = radarAxes.length
  return Array.from({length:n}, (_,i) => {
    const a=(i/n)*2*Math.PI-Math.PI/2
    return `${130+100*level*Math.cos(a)},${120+100*level*Math.sin(a)}`
  }).join(' ')
}
function radarDataPts(vals: number[]) {
  const n = radarAxes.length
  return vals.map((v,i) => { const a=(i/n)*2*Math.PI-Math.PI/2; return `${130+100*v*Math.cos(a)},${120+100*v*Math.sin(a)}` }).join(' ')
}
const stackedRaw = [
  {label:'Jan',segs:[62,28,10]},{label:'Feb',segs:[55,35,10]},{label:'Mar',segs:[48,32,20]},
  {label:'Apr',segs:[70,20,10]},{label:'May',segs:[60,28,12]},{label:'Jun',segs:[52,33,15]},
]
const stackColors  = ['#6366f1','#22c55e','#f59e0b']
const stackedLegend = [{label:'Series A',color:'#6366f1'},{label:'Series B',color:'#22c55e'},{label:'Series C',color:'#f59e0b'}]
const stackedBars  = computed(() => stackedRaw.map(d => {
  let y = 170
  const segs = [...d.segs].reverse().map((v,si) => { const h=v*1.4; y-=h; return {y,h,color:stackColors[2-si]} })
  return { label:d.label, segs:segs.reverse() }
}))
const areaChartCode  = `<!-- Area chart with gradient fill -->`
const hbarChartCode  = `<!-- Horizontal bar chart -->`
const pieChartCode   = `<!-- SVG pie chart -->`
const scatterCode    = `<!-- Scatter plot -->`
const radarCode      = `<!-- Radar / spider chart -->`
const stackedBarCode = `<!-- Stacked bar chart -->`

// ── Data extras ────────────────────────────────────────────────────────────
const treeNodes = ref<ITreeNode[]>([
  { id:'src', label:'src', children:[
    { id:'views', label:'views', children:[
      { id:'home', label:'HomeView.vue', icon:'📄' }, { id:'proj', label:'ProjectsView.vue', icon:'📄' },
    ]},
    { id:'comps', label:'components', children:[
      { id:'navbar', label:'NavBar.vue', icon:'📄' }, { id:'footer', label:'Footer.vue', icon:'📄' },
    ]},
    { id:'app', label:'App.vue', icon:'📄' },
  ]},
  { id:'public', label:'public', children:[{ id:'ico', label:'favicon.ico', icon:'🖼' }]},
  { id:'pkg', label:'package.json', icon:'📦' },
])
const filterOptions   = ['Vue','TypeScript','CSS','Testing','API','Animation']
const activeFilters   = ref<string[]>([])
const filterAllItems  = [
  { name:'v-model directive',    type:'Vue',        badge:'badge-green'  },
  { name:'TypeScript generics',  type:'TypeScript', badge:'badge-blue'   },
  { name:'CSS Grid layout',      type:'CSS',        badge:'badge-yellow' },
  { name:'Vue transitions',      type:'Vue',        badge:'badge-green'  },
  { name:'fetch + async/await',  type:'API',        badge:'badge-blue'   },
  { name:'CSS custom properties',type:'CSS',        badge:'badge-yellow' },
  { name:'Animation keyframes',  type:'Animation',  badge:'badge-red'    },
  { name:'Vitest unit tests',    type:'Testing',    badge:'badge-red'    },
  { name:'Pinia state',          type:'Vue',        badge:'badge-green'  },
  { name:'TypeScript interfaces',type:'TypeScript', badge:'badge-blue'   },
]
const filterResults = computed(() =>
  activeFilters.value.length ? filterAllItems.filter(i => activeFilters.value.includes(i.type)) : filterAllItems
)
const csvHeaders = ['Name','Role','Score']
const csvRows    = ref([
  { id:1, name:'Alice J.',  role:'Engineer',  score:94 },
  { id:2, name:'Bob S.',    role:'Designer',  score:87 },
  { id:3, name:'Carol W.',  role:'Marketing', score:72 },
  { id:4, name:'David B.',  role:'Engineer',  score:91 },
])
const csvExported = ref(false)
function exportCsv() {
  const header = csvHeaders.join(',')
  const rows   = csvRows.value.map(r => [r.name, r.role, r.score].join(','))
  const blob   = new Blob([[header, ...rows].join('\n')], { type:'text/csv' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'export.csv'; a.click()
  csvExported.value = true; setTimeout(() => csvExported.value = false, 2000)
}
interface InlineRow { id:number; name:string; role:string; score:number|string }
const inlineRows    = ref<InlineRow[]>([
  { id:1, name:'Alice J.',  role:'Engineer',  score:94 },
  { id:2, name:'Bob S.',    role:'Designer',  score:87 },
  { id:3, name:'Carol W.',  role:'Marketing', score:72 },
  { id:4, name:'David B.',  role:'Engineer',  score:91 },
])
const inlineEditing = ref<{ id:number; col:string }|null>(null)
function startInlineEdit(id: number, col: string) { inlineEditing.value = { id, col } }
function commitInline(id: number, col: string, val: string) {
  const row = inlineRows.value.find(r => r.id === id)
  if (row) (row as any)[col] = col === 'score' ? Number(val) : val
  inlineEditing.value = null
}
const treeViewCode   = `<!-- Recursive TreeNode component -->
<TreeNode v-for="node in tree" :key="node.id" :node="node" :depth="0" />`
const filterBarCode  = `<button v-for="f in options" :class="active.includes(f)?'btn-primary':'btn-secondary'"
  @click="toggle(f)">{{ f }}</button>`
const csvExportCode  = `function exportCsv() {
  const rows = data.map(r => cols.map(c => r[c]).join(','))
  const blob = new Blob([rows.join('\\n')], { type:'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob); a.download = 'data.csv'; a.click()
}`
const inlineEditCode = `<td @click="startEdit(row.id, col)">
  <input v-if="editing?.id===row.id && editing?.col===col" v-focus
    @keyup.enter="commit" @blur="commit" />
  <span v-else>{{ row[col] }}</span>
</td>`

// ── Navigation extras ──────────────────────────────────────────────────────
const vertTabList    = ['General','Security','Billing','Notifications','API Keys']
const vertTabActive  = ref('General')
const underlineTabList   = ['All','Active','Draft','Archived','Deleted']
const underlineTabActive = ref('All')

const cmdOpen  = ref(false)
const cmdQuery = ref('')
const cmdGroups = [
  { label:'Pages',   items:[{ icon:'🏠', label:'Home', shortcut:'G H' },{ icon:'📊', label:'Dashboard', shortcut:'G D' },{ icon:'⚙️', label:'Settings', shortcut:'G S' }]},
  { label:'Actions', items:[{ icon:'➕', label:'New Project', shortcut:'⌘N' },{ icon:'🔍', label:'Search Docs', shortcut:'⌘/' }]},
]
const cmdFiltered = computed(() =>
  cmdQuery.value
    ? cmdGroups.map(g => ({ ...g, items:g.items.filter(i => i.label.toLowerCase().includes(cmdQuery.value.toLowerCase())) })).filter(g => g.items.length)
    : cmdGroups
)

const ctxOpen  = ref(false)
const ctxX     = ref(0)
const ctxY     = ref(0)
const ctxItems = [
  { icon:'📋', label:'Copy',   danger:false }, { icon:'✂️', label:'Cut',    danger:false },
  { icon:'📌', label:'Pin',    danger:false }, { icon:'🗑',  label:'Delete', danger:true  },
]
function openContextMenu(e: MouseEvent) { ctxX.value = e.clientX; ctxY.value = e.clientY; ctxOpen.value = true }

const vertTabsCode      = `<button :style="active===tab?'border-left-color:var(--accent)':''" @click="active=tab">{{ tab }}</button>`
const underlineTabsCode = `<button :style="active===tab?'border-bottom-color:var(--accent)':''" @click="active=tab">{{ tab }}</button>`
const cmdPaletteCode    = `<Teleport to="body">
  <div v-if="open" @click.self="open=false">
    <input v-model="query" placeholder="Search…" />
    <button v-for="cmd in filtered" @click="run(cmd)">{{ cmd.label }}</button>
  </div>
</Teleport>`
const contextMenuCode   = `<div @contextmenu.prevent="open($event)">Right-click</div>
<div v-if="show" :style="{ top:y+'px',left:x+'px' }">…</div>`
const navLinksCode      = `<a href="#" style="color:var(--accent2)">Accent</a>
<a href="#" style="color:var(--text2)">Muted</a>`

// ── Feedback extras ────────────────────────────────────────────────────────
const popovers = [
  { label:'Info Popover', pos:'top',   title:'More info', body:'Rich content with pointer arrow.'   },
  { label:'Side Popover', pos:'right', title:'Pro tip',   body:'Close me by clicking elsewhere.'    },
]
const popOpen       = ref<number|null>(null)
const drawerOpen    = ref<string|null>(null)
const confirmOpen   = ref(false)
const confirmResult = ref('')
const loadingBtn    = ref(false)
const notifOpen     = ref(false)
const notifItems    = ref([
  { id:1, icon:'🚀', title:'Deployment succeeded',  time:'2 min ago',  read:false },
  { id:2, icon:'🔔', title:'New comment on PR #42',  time:'15 min ago', read:false },
  { id:3, icon:'✅', title:'Tests passed (142/142)',  time:'1 hr ago',   read:true  },
  { id:4, icon:'⚠️', title:'Disk usage at 87%',       time:'3 hrs ago',  read:true  },
])
const notifUnread = computed(() => notifItems.value.filter(n => !n.read).length)
const progressStepsList = ref([
  { title:'Create account',       desc:'Sign up with email or OAuth',          done:true  },
  { title:'Verify email',         desc:'Check your inbox for confirmation',     done:true  },
  { title:'Set up workspace',     desc:'Create or join an existing workspace',  done:false },
  { title:'Invite team members',  desc:'Add colleagues and assign roles',       done:false },
  { title:'Deploy first project', desc:'Connect a repo and trigger a deploy',   done:false },
])

const popoverCode        = `<button @click="open=!open">Info</button>
<div v-if="open" class="sb-popover">Popover content</div>`
const drawerCode         = `<Teleport to="body">
  <div v-if="open" class="overlay" @click.self="open=false">
    <div class="drawer">Drawer content</div>
  </div>
</Teleport>`
const confirmDialogCode  = `<div v-if="open">
  <p>Are you sure?</p>
  <button @click="confirm()">Yes</button>
  <button @click="open=false">Cancel</button>
</div>`
const loadingStatesCode  = `<button :disabled="loading" @click="trigger">
  <span v-if="loading" class="sb-spinner" />
  {{ loading ? 'Loading…' : 'Submit' }}
</button>`
const notifBellCode      = `<button @click="open=!open">🔔 <span>{{ unread }}</span></button>
<div v-if="open">{{ notifications }}</div>`
const progressStepsCode  = `<div v-for="(step,i) in steps" @click="step.done=!step.done">
  <span>{{ step.done ? '✓' : i+1 }}</span> {{ step.title }}
</div>`

// ── Patterns extras ────────────────────────────────────────────────────────
const carouselSlides = [
  { emoji:'🚀', title:'Performance First',  desc:'Blazing fast with Vite and lazy-loaded routes.',  bg:'rgba(99,102,241,.18)' },
  { emoji:'🎨', title:'Beautiful UI',        desc:'A complete design system with dark-mode first.',  bg:'rgba(16,185,129,.18)' },
  { emoji:'⚡', title:'Reactive by Default', desc:'Fine-grained reactivity via Vue 3 Proxies.',      bg:'rgba(245,158,11,.18)' },
  { emoji:'🔒', title:'Type Safe',           desc:'End-to-end TypeScript with strict mode.',         bg:'rgba(239,68,68,.18)'  },
]
const carouselIdx = ref(0)

const dragItems   = ref([
  { id:1, emoji:'🏠', label:'Home' }, { id:2, emoji:'📊', label:'Analytics' },
  { id:3, emoji:'🛒', label:'Orders' }, { id:4, emoji:'👥', label:'Customers' }, { id:5, emoji:'⚙️', label:'Settings' },
])
const dragFromIdx = ref<number|null>(null)
const dragOver    = ref<number|null>(null)
function dragListStart(i: number) { dragFromIdx.value = i }
function dragListDrop(i: number) {
  if (dragFromIdx.value === null || dragFromIdx.value === i) return
  const items = [...dragItems.value], [r] = items.splice(dragFromIdx.value, 1)
  items.splice(i, 0, r); dragItems.value = items; dragFromIdx.value = null; dragOver.value = null
}

const twPhrases   = ['Build something amazing.','Vue 3 is incredible!','TypeScript + Vite = ❤️','Component driven design.']
const twPhraseIdx = ref(0)
const twPos       = ref(0)
const twDisplayed = computed(() => twPhrases[twPhraseIdx.value].slice(0, twPos.value))
const twPaused    = ref(false)
let twTimer: ReturnType<typeof setInterval>|null = null
function twStartTimer() {
  twTimer = setInterval(() => {
    if (twPaused.value) return
    if (twPos.value < twPhrases[twPhraseIdx.value].length) { twPos.value++ }
    else {
      clearInterval(twTimer!); setTimeout(() => { twPhraseIdx.value=(twPhraseIdx.value+1)%twPhrases.length; twPos.value=0; twStartTimer() }, 2000)
    }
  }, 60)
}
function twRestart() { clearInterval(twTimer!); twPhraseIdx.value=0; twPos.value=0; twPaused.value=false; twStartTimer() }

interface ChatMsg { id:number; sent:boolean; from:string; text:string; time:string }
const chatMessages = ref<ChatMsg[]>([
  { id:1, sent:false, from:'Alice', text:'Hey! Have you seen the new storybook?',  time:'10:22 AM' },
  { id:2, sent:true,  from:'Me',   text:'Yes! The components look really clean.',   time:'10:23 AM' },
  { id:3, sent:false, from:'Alice', text:'I especially love the chart section 📊',  time:'10:23 AM' },
  { id:4, sent:true,  from:'Me',   text:'Same! The radar chart is my favourite.',   time:'10:24 AM' },
])
const chatInput = ref('')
let chatId = 5
function sendChat() {
  if (!chatInput.value.trim()) return
  chatMessages.value.push({ id:chatId++, sent:true, from:'Me', text:chatInput.value, time:new Date().toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit'}) })
  const q = chatInput.value; chatInput.value = ''
  setTimeout(() => chatMessages.value.push({ id:chatId++, sent:false, from:'Alice', text:`You said: "${q}" 👍`, time:new Date().toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit'}) }), 700)
}

const splitPct      = ref(45)
const splitDragging = ref(false)
function doSplit(e: MouseEvent) {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  splitPct.value = Math.max(20, Math.min(80, ((e.clientX - rect.left) / rect.width) * 100))
}

const onboardSteps = ref([
  { id:1, title:'Set up your profile',    done:true  }, { id:2, title:'Connect first repo',   done:true  },
  { id:3, title:'Run a deployment',       done:false }, { id:4, title:'Invite a team member', done:false },
  { id:5, title:'Set up custom domain',   done:false },
])
const onboardDone = computed(() => onboardSteps.value.filter(s => s.done).length)

const animDemos = ref([
  { name:'spin',     css:'sbspin .6s linear infinite',       key:0 },
  { name:'pulse',    css:'sb-pulse .8s ease-in-out infinite', key:0 },
  { name:'bounce',   css:'sb-bounce .7s ease infinite',       key:0 },
  { name:'shake',    css:'sb-shake .4s ease',                 key:0 },
  { name:'slide-in', css:'sb-slidein .4s ease',               key:0 },
  { name:'flip',     css:'sb-flip .6s ease',                  key:0 },
])

onMounted(() => {
  twStartTimer()
  document.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('[data-dropdown],[data-ctx]')) {
      ctxOpen.value = false
    }
  })
})
onUnmounted(() => { clearInterval(twTimer!) })

const carouselCode   = `<div style="overflow:hidden"><div :style="{ transform: \`translateX(-\${idx*100}%)\` }">
  <div v-for="slide in slides" style="min-width:100%">{{ slide.title }}</div>
</div></div>`
const dragListCode   = `<div v-for="(item,i) in items" draggable="true"
  @dragstart="from=i" @dragover.prevent @drop="drop(i)">{{ item.label }}</div>`
const typewriterCode = `const typed = ref('')
const phrases = ['Hello…','World!']
setInterval(() => typed.value += phrase[i++], 60)`
const chatCode       = `<div v-for="msg in messages" :style="msg.sent?'align-self:flex-end':''">
  {{ msg.text }}
</div>`
const splitViewCode  = `<div @mousemove="drag&&resize($event)" @mouseup="drag=false">
  <div :style="{ width: pct+'%' }">Panel A</div>
  <div class="handle" @mousedown="drag=true" />
  <div>Panel B</div>
</div>`
const onboardingCode = `<div v-for="step in steps" @click="step.done=!step.done">
  <span>{{ step.done ? '✓' : '○' }}</span> {{ step.title }}
</div>`
const animationsCode = `@keyframes sb-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
@keyframes sb-shake  { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }`

// ── Pivot Table ──────────────────────────────────────────────────────────────
const pivotRaw = [
  { region: 'North', product: 'Widget A', sales: 120 },
  { region: 'North', product: 'Widget B', sales: 85  },
  { region: 'North', product: 'Widget C', sales: 67  },
  { region: 'South', product: 'Widget A', sales: 95  },
  { region: 'South', product: 'Widget B', sales: 140 },
  { region: 'South', product: 'Widget C', sales: 88  },
  { region: 'East',  product: 'Widget A', sales: 78  },
  { region: 'East',  product: 'Widget B', sales: 62  },
  { region: 'East',  product: 'Widget C', sales: 110 },
  { region: 'West',  product: 'Widget A', sales: 110 },
  { region: 'West',  product: 'Widget B', sales: 99  },
  { region: 'West',  product: 'Widget C', sales: 75  },
]
const pivotRegions  = computed(() => [...new Set(pivotRaw.map(r => r.region))])
const pivotProducts = computed(() => [...new Set(pivotRaw.map(r => r.product))])
function pivotCell(region: string, product: string) {
  return pivotRaw.find(r => r.region === region && r.product === product)?.sales ?? 0
}
function pivotRowTotal(region: string) {
  return pivotRaw.filter(r => r.region === region).reduce((s, r) => s + r.sales, 0)
}
function pivotColTotal(product: string) {
  return pivotRaw.filter(r => r.product === product).reduce((s, r) => s + r.sales, 0)
}
const pivotGrandTotal = computed(() => pivotRaw.reduce((s, r) => s + r.sales, 0))

// ── Spreadsheet ──────────────────────────────────────────────────────────────
const ssHeaders = ['A', 'B', 'C', 'D', 'Total']
const ssData = ref([
  ['10', '20', '30', '40'],
  ['5',  '15', '25', '35'],
  ['7',  '14', '21', '28'],
  ['3',  '9',  '27', '81'],
  ['12', '8',  '4',  '2' ],
])
function ssRowSum(ri: number) {
  return ssData.value[ri].reduce((s, v) => s + (parseFloat(v) || 0), 0)
}
function ssColSum(ci: number) {
  return ssData.value.reduce((s, r) => s + (parseFloat(r[ci]) || 0), 0)
}
const ssGrandTotal = computed(() =>
  ssData.value.reduce((s, row) => s + row.reduce((rs, v) => rs + (parseFloat(v) || 0), 0), 0)
)

// ── Sortable Table ────────────────────────────────────────────────────────────
const stFilter  = ref('')
const stSortCol = ref('name')
const stSortAsc = ref(true)
const stCols = [
  { key: 'name',   label: 'Name'       },
  { key: 'dept',   label: 'Department' },
  { key: 'salary', label: 'Salary'     },
  { key: 'status', label: 'Status'     },
  { key: 'joined', label: 'Joined'     },
]
const stEmployees = [
  { name: 'Alice Johnson', dept: 'Engineering', salary: 112000, status: 'Active',   joined: '2021-03' },
  { name: 'Bob Martinez',  dept: 'Marketing',   salary:  85000, status: 'Active',   joined: '2019-07' },
  { name: 'Carol White',   dept: 'Engineering', salary: 128000, status: 'Active',   joined: '2020-01' },
  { name: 'Dave Chen',     dept: 'Design',      salary:  92000, status: 'Leave',    joined: '2022-05' },
  { name: 'Eve Patel',     dept: 'Marketing',   salary:  78000, status: 'Active',   joined: '2023-02' },
  { name: 'Frank Kim',     dept: 'Engineering', salary: 135000, status: 'Active',   joined: '2018-11' },
  { name: 'Grace Liu',     dept: 'Design',      salary:  95000, status: 'Active',   joined: '2021-09' },
  { name: 'Henry Wu',      dept: 'Marketing',   salary:  82000, status: 'Inactive', joined: '2017-06' },
]
const stSorted = computed(() => {
  let rows = stEmployees.filter(r =>
    !stFilter.value || Object.values(r).some(v => String(v).toLowerCase().includes(stFilter.value.toLowerCase()))
  )
  return [...rows].sort((a, b) => {
    const av = (a as any)[stSortCol.value]
    const bv = (b as any)[stSortCol.value]
    return stSortAsc.value ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
  })
})
function stToggleSort(col: string) {
  if (stSortCol.value === col) stSortAsc.value = !stSortAsc.value
  else { stSortCol.value = col; stSortAsc.value = true }
}

// ── Comparison Table ──────────────────────────────────────────────────────────
const cmpPlans = [
  { name: 'Free',       price: '$0/mo',   features: ['5 Projects', 'Basic Analytics', 'Email Support', 'API Access'] },
  { name: 'Pro',        price: '$12/mo',  features: ['5 Projects', 'Basic Analytics', 'Email Support', 'API Access', 'Unlimited Projects', 'Advanced Analytics', 'Priority Support'] },
  { name: 'Enterprise', price: '$49/mo',  features: ['5 Projects', 'Basic Analytics', 'Email Support', 'API Access', 'Unlimited Projects', 'Advanced Analytics', 'Priority Support', 'SSO / SAML', 'Custom Integrations', 'SLA Guarantee'] },
]
const cmpFeatures = ['5 Projects', 'Basic Analytics', 'Email Support', 'API Access', 'Unlimited Projects', 'Advanced Analytics', 'Priority Support', 'SSO / SAML', 'Custom Integrations', 'SLA Guarantee']

// ── Cross-Tab ─────────────────────────────────────────────────────────────────
const ctRaw = [
  { dept: 'Engineering', quarter: 'Q1', count: 12 },
  { dept: 'Engineering', quarter: 'Q2', count: 14 },
  { dept: 'Engineering', quarter: 'Q3', count: 15 },
  { dept: 'Engineering', quarter: 'Q4', count: 18 },
  { dept: 'Marketing',   quarter: 'Q1', count:  8 },
  { dept: 'Marketing',   quarter: 'Q2', count:  9 },
  { dept: 'Marketing',   quarter: 'Q3', count:  8 },
  { dept: 'Marketing',   quarter: 'Q4', count: 11 },
  { dept: 'Design',      quarter: 'Q1', count:  5 },
  { dept: 'Design',      quarter: 'Q2', count:  6 },
  { dept: 'Design',      quarter: 'Q3', count:  7 },
  { dept: 'Design',      quarter: 'Q4', count:  7 },
  { dept: 'Sales',       quarter: 'Q1', count:  6 },
  { dept: 'Sales',       quarter: 'Q2', count:  8 },
  { dept: 'Sales',       quarter: 'Q3', count: 10 },
  { dept: 'Sales',       quarter: 'Q4', count: 12 },
]
const ctDepts    = computed(() => [...new Set(ctRaw.map(r => r.dept))])
const ctQuarters = computed(() => [...new Set(ctRaw.map(r => r.quarter))])
function ctCell(dept: string, quarter: string) {
  return ctRaw.find(r => r.dept === dept && r.quarter === quarter)?.count ?? 0
}
function ctRowTotal(dept: string) {
  return ctRaw.filter(r => r.dept === dept).reduce((s, r) => s + r.count, 0)
}
function ctColTotal(q: string) {
  return ctRaw.filter(r => r.quarter === q).reduce((s, r) => s + r.count, 0)
}
const ctGrandTotal = computed(() => ctRaw.reduce((s, r) => s + r.count, 0))

// ── Freeze Table ──────────────────────────────────────────────────────────────
const ftHeaders = ['Q1 Rev', 'Q2 Rev', 'Q3 Rev', 'Q4 Rev', 'YoY %', 'Mkt Cap', 'P/E', 'Rating']
const ftRows = [
  ['Apple',     '$117B', '$94B',  '$90B',  '$124B', '+8%',  '$2.9T', '29', '★★★★★'],
  ['Microsoft', '$56B',  '$52B',  '$55B',  '$62B',  '+13%', '$2.8T', '35', '★★★★★'],
  ['Google',    '$80B',  '$74B',  '$76B',  '$86B',  '+11%', '$1.8T', '26', '★★★★☆'],
  ['Amazon',    '$143B', '$127B', '$131B', '$170B', '+12%', '$1.7T', '58', '★★★★☆'],
  ['Meta',      '$36B',  '$32B',  '$34B',  '$40B',  '+23%', '$1.3T', '24', '★★★★☆'],
]

// ── Row Selection Table ───────────────────────────────────────────────────────
const rsRows = ref([
  { id: 1, name: 'Project Alpha',   status: 'Active',   budget: '$24,000' },
  { id: 2, name: 'Project Beta',    status: 'Pending',  budget: '$18,500' },
  { id: 3, name: 'Project Gamma',   status: 'Active',   budget: '$31,200' },
  { id: 4, name: 'Project Delta',   status: 'Complete', budget: '$9,800'  },
  { id: 5, name: 'Project Epsilon', status: 'Active',   budget: '$42,000' },
])
const rsSelected = ref<number[]>([])
const rsAllSelected = computed({
  get: () => rsRows.value.length > 0 && rsSelected.value.length === rsRows.value.length,
  set: (v: boolean) => { rsSelected.value = v ? rsRows.value.map(r => r.id) : [] },
})
function rsDelete() {
  rsRows.value = rsRows.value.filter(r => !rsSelected.value.includes(r.id))
  rsSelected.value = []
}

// ── Waterfall Chart ───────────────────────────────────────────────────────────
const waterfallBars = [
  { label: 'Start', value: 400, cumulative: 0,   isTotal: true  },
  { label: 'Q1',    value: 120, cumulative: 400, isTotal: false },
  { label: 'Q2',    value: -80, cumulative: 520, isTotal: false },
  { label: 'Q3',    value: 150, cumulative: 440, isTotal: false },
  { label: 'Q4',    value: 200, cumulative: 590, isTotal: false },
  { label: 'End',   value: 790, cumulative: 0,   isTotal: true  },
]
const wfMaxVal = 900
function wfBarY(bar: (typeof waterfallBars)[0]) {
  const h = 160
  if (bar.isTotal) return h - (bar.value / wfMaxVal) * h
  return bar.value >= 0
    ? h - ((bar.cumulative + bar.value) / wfMaxVal) * h
    : h - (bar.cumulative / wfMaxVal) * h
}
function wfBarH(bar: (typeof waterfallBars)[0]) {
  return Math.max(2, Math.abs(bar.value) / wfMaxVal * 160)
}

// ── Bubble Chart ──────────────────────────────────────────────────────────────
const bubbleData = [
  { label: 'Vue',     x: 75, y: 85, r: 28, color: '#41b883' },
  { label: 'React',   x: 90, y: 78, r: 42, color: '#61dafb' },
  { label: 'Angular', x: 55, y: 70, r: 24, color: '#dd0031' },
  { label: 'Svelte',  x: 82, y: 92, r: 18, color: '#ff3e00' },
  { label: 'Solid',   x: 88, y: 95, r: 14, color: '#4284f4' },
  { label: 'Nuxt',    x: 65, y: 80, r: 20, color: '#00c58e' },
]
const bubbleHover = ref<number | null>(null)

// ── Funnel Chart ──────────────────────────────────────────────────────────────
const funnelSteps = [
  { label: 'Visitors',  value: 10000, color: '#6366f1' },
  { label: 'Sign-ups',  value:  3200, color: '#8b5cf6' },
  { label: 'Trials',    value:  1400, color: '#a855f7' },
  { label: 'Customers', value:   520, color: '#d946ef' },
]
const funnelMax = 10000

// ── Treemap ───────────────────────────────────────────────────────────────────
const treemapData = [
  { label: 'Tech',       value: 38, color: '#6366f1' },
  { label: 'Finance',    value: 22, color: '#22c55e' },
  { label: 'Healthcare', value: 18, color: '#f59e0b' },
  { label: 'Energy',     value: 12, color: '#ef4444' },
  { label: 'Consumer',   value:  7, color: '#06b6d4' },
  { label: 'Utilities',  value:  3, color: '#8b5cf6' },
]
const treemapRects = computed(() => {
  const W = 500, H = 200
  const total = treemapData.reduce((s, d) => s + d.value, 0)
  let y = 0
  return treemapData.map(d => {
    const h = (d.value / total) * H
    const r = { x: 0, y, w: W, h, label: d.label, value: d.value, color: d.color }
    y += h
    return r
  })
})

// ── Candlestick ───────────────────────────────────────────────────────────────
const candleData = [
  { d: 'Mon', o: 142, h: 148, l: 138, c: 145 },
  { d: 'Tue', o: 145, h: 152, l: 143, c: 150 },
  { d: 'Wed', o: 150, h: 155, l: 146, c: 148 },
  { d: 'Thu', o: 148, h: 151, l: 140, c: 141 },
  { d: 'Fri', o: 141, h: 149, l: 139, c: 147 },
  { d: 'Sat', o: 147, h: 153, l: 145, c: 152 },
  { d: 'Sun', o: 152, h: 158, l: 149, c: 155 },
]
const candleMinV = 135, candleMaxV = 162, candleHpx = 160
function candleY(v: number) { return candleHpx - ((v - candleMinV) / (candleMaxV - candleMinV)) * candleHpx }

// ── Multi-line Chart ──────────────────────────────────────────────────────────
const mlMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const mlSeries = [
  { name: 'Revenue',  color: '#6366f1', values: [42,48,55,51,60,68,72,70,78,82,88,94] },
  { name: 'Expenses', color: '#ef4444', values: [30,32,35,38,36,40,42,39,44,46,48,50] },
  { name: 'Profit',   color: '#22c55e', values: [12,16,20,13,24,28,30,31,34,36,40,44] },
]
const mlHpx = 150, mlWpx = 470, mlMaxV = 100
function mlPoints(values: number[]) {
  return values.map((v, i) => `${30 + (i / 11) * mlWpx},${mlHpx - (v / mlMaxV) * mlHpx}`).join(' ')
}

// ── Virtual List ──────────────────────────────────────────────────────────────
const vlAllItems = Array.from({ length: 10000 }, (_, i) => ({
  id:    i + 1,
  name:  `Record #${String(i + 1).padStart(5, '0')}`,
  value: ((i * 7919) % 1000) + 1,
}))
const vlItemHeight = 36
const vlScrollTop  = ref(0)
const vlStartIdx   = computed(() => Math.floor(vlScrollTop.value / vlItemHeight))
const vlVisible    = computed(() => vlAllItems.slice(vlStartIdx.value, vlStartIdx.value + 12))
function vlOnScroll(e: Event) { vlScrollTop.value = (e.target as HTMLElement).scrollTop }

// ── Rich Text Editor ──────────────────────────────────────────────────────────
const rtEl = ref<HTMLElement | null>(null)
function rtExec(cmd: string) {
  rtEl.value?.focus()
  document.execCommand(cmd, false, undefined)
}

// ── Date Picker ───────────────────────────────────────────────────────────────
const dpYear     = ref(new Date().getFullYear())
const dpMonth    = ref(new Date().getMonth())
const dpSelected = ref<string | null>(null)
const dpMonthName = computed(() =>
  new Date(dpYear.value, dpMonth.value).toLocaleString('default', { month: 'long' })
)
const dpDays = computed(() => {
  const first = new Date(dpYear.value, dpMonth.value, 1).getDay()
  const total = new Date(dpYear.value, dpMonth.value + 1, 0).getDate()
  return [...Array(first).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)]
})
function dpKey(day: number) {
  return `${dpYear.value}-${String(dpMonth.value + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
}
function dpPrev() { if (dpMonth.value === 0) { dpMonth.value = 11; dpYear.value-- } else dpMonth.value-- }
function dpNext() { if (dpMonth.value === 11) { dpMonth.value = 0; dpYear.value++ } else dpMonth.value++ }

// ── File Upload ───────────────────────────────────────────────────────────────
const fuFiles    = ref<{ name: string; size: string }[]>([])
const fuDragging = ref(false)
function fuDrop(e: DragEvent) {
  fuDragging.value = false
  const files = Array.from(e.dataTransfer?.files ?? [])
  fuFiles.value.push(...files.map(f => ({ name: f.name, size: (f.size / 1024).toFixed(1) + ' KB' })))
}
function fuPick(e: Event) {
  const files = Array.from((e.target as HTMLInputElement).files ?? [])
  fuFiles.value.push(...files.map(f => ({ name: f.name, size: (f.size / 1024).toFixed(1) + ' KB' })))
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
const dashStats = [
  { label: 'Total Revenue', value: '$128,400', change: '+12%', up: true  },
  { label: 'Active Users',  value: '4,821',    change: '+8%',  up: true  },
  { label: 'Avg Session',   value: '3m 42s',   change: '-3%',  up: false },
  { label: 'Conversion',    value: '5.2%',     change: '+1.1%',up: true  },
]
const dashSources = [
  { label: 'Organic Search', pct: 42, color: '#6366f1' },
  { label: 'Direct',         pct: 28, color: '#22c55e' },
  { label: 'Referral',       pct: 18, color: '#f59e0b' },
  { label: 'Social',         pct: 12, color: '#ef4444' },
]

// ── Gantt Chart ───────────────────────────────────────────────────────────────
const ganttTasks = [
  { name: 'Planning',    start: 0,  duration: 3, color: '#6366f1' },
  { name: 'Design',      start: 2,  duration: 4, color: '#8b5cf6' },
  { name: 'Development', start: 4,  duration: 8, color: '#22c55e' },
  { name: 'Testing',     start: 10, duration: 3, color: '#f59e0b' },
  { name: 'Deployment',  start: 12, duration: 2, color: '#ef4444' },
]
const ganttTotalDays = 15

// ── JSON Viewer ───────────────────────────────────────────────────────────────
const JsonNode = defineComponent({
  name: 'JsonNode',
  props: {
    data:  { type: null as any },
    label: { type: String },
    depth: { type: Number, default: 0 },
  },
  setup(props) {
    const open    = ref(true)
    const isObj   = computed(() => props.data !== null && typeof props.data === 'object')
    const entries = computed(() => isObj.value ? Object.entries(props.data as object) : [])
    const valColor = computed(() => {
      if (typeof props.data === 'number') return '#f59e0b'
      if (typeof props.data === 'boolean') return '#ef4444'
      if (typeof props.data === 'string')  return '#22c55e'
      return 'var(--text2)'
    })
    return { open, isObj, entries, valColor }
  },
  template: `
    <div :style="{ paddingLeft: depth*16+'px', fontFamily:'monospace', fontSize:'.82rem', lineHeight:'1.8' }">
      <template v-if="isObj">
        <span style="cursor:pointer;user-select:none" @click="open=!open">{{ open ? '▾' : '▸' }}</span>
        <span v-if="label !== undefined" style="color:#7dd3fc"> "{{ label }}"</span>
        <span v-if="label !== undefined"> : </span>
        <span style="color:var(--text2)">{{ Array.isArray(data) ? '[' : '{' }}</span>
        <span v-if="!open" style="color:var(--text2);cursor:pointer" @click="open=true"> … {{ Array.isArray(data) ? ']' : '}' }}</span>
        <template v-if="open">
          <JsonNode v-for="[k,v] in entries" :key="k" :data="v" :label="k" :depth="depth+1" />
          <div :style="{ paddingLeft: depth*16+'px' }" style="color:var(--text2)">{{ Array.isArray(data) ? ']' : '}' }}</div>
        </template>
      </template>
      <template v-else>
        <span v-if="label !== undefined" style="color:#7dd3fc"> "{{ label }}"</span>
        <span v-if="label !== undefined"> : </span>
        <span :style="{ color: valColor }">{{ typeof data === 'string' ? '"' + data + '"' : String(data) }}</span>
      </template>
    </div>`,
})
const jsonViewerData = {
  name: 'vue-storybook', version: '1.0.0',
  stats: { components: 103, groups: 10, lines: 4800 },
  features: ['TypeScript', 'Composition API', 'SVG Charts', 'Virtual Scroll'],
  config: { darkMode: true, port: 8080, build: { minify: true, sourcemap: false } },
}

// ── Code strings ──────────────────────────────────────────────────────────────
const pivotCode = `<th v-for="p in products">{{ p }}</th>
<tr v-for="r in regions">
  <td v-for="p in products">{{ cell(r,p) }}</td>
  <td>{{ rowTotal(r) }}</td>
</tr>`
const spreadsheetCode = `<td v-for="ci in 4" style="padding:0">
  <input class="sb-cell-input" v-model="data[ri][ci-1]" />
</td>
<td>{{ rowSum(ri) }}</td>`
const sortTableCode = `<th @click="toggleSort(col.key)">
  {{ col.label }} {{ sortIcon }}
</th>
<tr v-for="row in sorted">…</tr>`
const comparisonCode = `<td v-for="plan in plans" style="text-align:center">
  <span :style="{ color: plan.has(feat) ? '#22c55e' : '#ef4444' }">
    {{ plan.has(feat) ? '✓' : '✗' }}
  </span>
</td>`
const crosstabCode = `<tr v-for="dept in depts">
  <td v-for="q in quarters">{{ cell(dept,q) }}</td>
  <td>{{ rowTotal(dept) }}</td>
</tr>`
const freezeTableCode = `.sb-sticky-col {
  position: sticky; left: 0;
  background: var(--bg2); z-index: 1;
}`
const rowSelectCode = `<input type="checkbox" v-model="allSelected" />
<tr v-for="row in rows">
  <input type="checkbox" :value="row.id" v-model="selected" />
</tr>
<button @click="deleteSelected">Delete</button>`
const waterfallCode = `<rect v-for="bar in bars"
  :x="barX(bar)" :y="barY(bar)" :height="barH(bar)"
  :fill="bar.isTotal ? '#6366f1' : bar.value>=0 ? '#22c55e' : '#ef4444'" />`
const bubbleChartCode = `<circle v-for="(b,i) in data"
  :cx="scaleX(b.x)" :cy="scaleY(b.y)"
  :r="hover===i ? b.r+5 : b.r"
  :fill="b.color+'88'" :stroke="b.color"
  @mouseenter="hover=i" @mouseleave="hover=null" />`
const funnelCode = `<div v-for="(step,i) in steps"
  :style="{ width: step.value/max*100+'%', background: step.color }">
  {{ step.label }}: {{ step.value.toLocaleString() }}
</div>`
const treemapCode = `const rects = computed(() => {
  let y = 0
  return data.map(d => {
    const h = (d.value/total)*H
    return { x:0, y: y+=h, w:W, h, ...d }
  })
})`
const candlestickCode = `<line :y1="candleY(c.h)" :y2="candleY(c.l)" :stroke="color(c)" />
<rect :y="candleY(Math.max(c.o,c.c))"
  :height="Math.abs(candleY(c.o)-candleY(c.c))"
  :fill="c.c>=c.o ? '#22c55e' : '#ef4444'" />`
const multiLineCode = `<polyline v-for="s in series"
  :points="points(s.values)"
  :stroke="s.color" fill="none"
  stroke-width="2.5" />`
const virtualListCode = `const startIdx = computed(() =>
  Math.floor(scrollTop.value / itemH))
const visible = computed(() =>
  allItems.slice(startIdx.value, startIdx.value+12))`
const richTextCode = `<button @click="exec('bold')"><b>B</b></button>
<button @click="exec('italic')"><i>I</i></button>
<div ref="editor" contenteditable="true" />`
const datePickerCode = `const days = computed(() => {
  const blanks = Array(firstDay).fill(null)
  const nums   = Array.from({length:daysInMonth},(_,i)=>i+1)
  return [...blanks, ...nums]
})`
const fileUploadCode = `<div @dragover.prevent @drop.prevent="onDrop"
  :class="{ active: dragging }">
  Drop files here
  <input type="file" @change="onPick" />
</div>`
const dashboardCode = `<div class="dashboard">
  <div v-for="stat in stats" class="stat-card">
    <div>{{ stat.label }}</div>
    <div>{{ stat.value }}</div>
    <div :style="{ color: stat.up ? 'green':'red' }">{{ stat.change }}</div>
  </div>
</div>`
const ganttCode = `<rect v-for="task in tasks"
  :x="60 + task.start * dayW"
  :width="task.duration * dayW - 4"
  :fill="task.color" rx="5" />`
const jsonViewerCode = `<!-- Recursive JsonNode component -->
<JsonNode :data="json" :depth="0" />

setup(props) {
  const open    = ref(true)
  const isObj   = computed(() => typeof props.data === 'object')
  const entries = computed(() => Object.entries(props.data))
  return { open, isObj, entries }
}`
</script>

<style>
/* ── Shell ── */
.sb-layout { display:flex; min-height:100vh; }

.sb-sidebar {
  width:240px; flex-shrink:0; background:var(--bg2);
  border-right:1px solid var(--bg3);
  position:sticky; top:0; height:100vh; overflow-y:auto;
  display:flex; flex-direction:column;
}
.sb-logo { padding:20px 18px 12px; border-bottom:1px solid var(--bg3); }
.sb-home-link { font-size:0.8rem; color:var(--text2); display:inline-block; margin-bottom:6px; }
.sb-home-link:hover { color:var(--text); }
.sb-search { padding:10px 14px; }
.sb-search-input { width:100%; padding:7px 12px; background:var(--bg3); border:1px solid #475569; border-radius:6px; color:var(--text); font-size:0.82rem; outline:none; }
.sb-search-input:focus { border-color:var(--accent); }
.sb-nav { padding:4px 10px 20px; flex:1; }
.sb-group-label { font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--text2); padding:10px 8px 4px; }
.sb-nav-link { display:block; padding:6px 10px; border-radius:6px; font-size:0.85rem; color:var(--text2); cursor:pointer; transition:background .12s,color .12s; margin-bottom:1px; }
.sb-nav-link:hover { background:var(--bg3); color:var(--text); }
.sb-nav-link.active { background:rgba(99,102,241,.18); color:var(--accent2); font-weight:600; }

.sb-main { flex:1; overflow-y:auto; height:100vh; }

.sb-page-header { padding:32px 48px 24px; border-bottom:1px solid var(--bg3); }
.sb-page-breadcrumb { font-size:.75rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--text2); margin-bottom:6px; }
.sb-page-title-row { display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; }
.sb-page-title { font-size:1.9rem; font-weight:800; margin:0; }
.sb-page-nav { display:flex; gap:8px; }
.sb-page-nav .btn:disabled { opacity:.35; cursor:not-allowed; }

.sb-section { padding:36px 48px; }
.sb-section:last-child { border-bottom:none; }
.sb-section-title { font-size:1.35rem; font-weight:800; margin-bottom:6px; }
.sb-section-desc { font-size:0.88rem; color:var(--text2); margin-bottom:18px; line-height:1.6; }
.sb-section-desc code { background:var(--bg3); padding:2px 6px; border-radius:4px; font-family:monospace; font-size:.85em; }
.sb-sub { font-size:.8rem; font-weight:700; color:var(--text2); text-transform:uppercase; letter-spacing:.06em; margin:18px 0 8px; }

/* ── SbStory ── */
.sb-story { margin-bottom:4px; }
.sb-demo { background:var(--bg); border:1px solid var(--bg3); border-radius:10px 10px 0 0; padding:22px; position:relative; padding-bottom:42px; }
.sb-story:not(:has(.sb-code-panel)) .sb-demo { border-radius:10px; }
.sb-demo-row { display:flex; flex-wrap:wrap; gap:10px; align-items:center; }

.sb-code-btn { position:absolute; bottom:10px; right:10px; display:inline-flex; align-items:center; gap:5px; padding:5px 11px; background:var(--bg3); border:1px solid #475569; border-radius:6px; color:var(--text2); font-size:.78rem; font-weight:600; cursor:pointer; transition:all .15s; z-index:2; }
.sb-code-btn:hover { background:#475569; color:var(--text); border-color:var(--accent); }
.sb-code-btn.active { background:rgba(99,102,241,.2); color:var(--accent2); border-color:var(--accent); }
.sb-code-btn-icon { font-family:monospace; font-size:.85rem; letter-spacing:-.5px; }
.sb-code-btn-label { font-size:.75rem; }

.sb-code-panel { border:1px solid var(--bg3); border-top:none; border-radius:0 0 10px 10px; overflow:hidden; }
.sb-code-panel-bar { display:flex; align-items:center; justify-content:space-between; padding:6px 14px; background:#0d1929; border-bottom:1px solid var(--bg3); }
.sb-code-lang { font-size:.72rem; font-family:monospace; color:var(--accent2); font-weight:700; text-transform:uppercase; letter-spacing:.06em; }
.sb-copy-btn { background:none; border:1px solid var(--bg3); border-radius:5px; color:var(--text2); font-size:.75rem; padding:3px 10px; cursor:pointer; transition:color .15s,border-color .15s; }
.sb-copy-btn:hover { color:var(--text); border-color:#475569; }
.sb-code-pre { background:#0d1929; padding:16px 20px; font-family:monospace; font-size:.82rem; overflow-x:auto; color:#a5b4fc; line-height:1.65; white-space:pre; margin:0; }

/* ── Colors ── */
.sb-color-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(80px,1fr)); gap:12px; }
.sb-color-swatch { display:flex; flex-direction:column; gap:6px; }
.sb-color-box { width:100%; aspect-ratio:1; border-radius:8px; border:1px solid rgba(255,255,255,.08); }
.sb-color-name { font-size:.72rem; font-weight:700; color:var(--accent2); font-family:monospace; }
.sb-color-val  { font-size:.68rem; color:var(--text2); font-family:monospace; }

/* ── Toggles / Tabs ── */
.sb-toggle-wrap { display:flex; align-items:center; gap:10px; cursor:pointer; }
.sb-toggle { width:44px; height:24px; background:var(--bg3); border-radius:999px; position:relative; transition:background .2s; cursor:pointer; }
.sb-toggle.on { background:var(--accent); }
.sb-toggle-thumb { width:18px; height:18px; background:#fff; border-radius:50%; position:absolute; top:3px; left:3px; transition:left .2s; }
.sb-toggle.on .sb-toggle-thumb { left:23px; }
.sb-tabs { display:flex; background:var(--bg3); border-radius:8px 8px 0 0; overflow:hidden; }
.sb-tab { flex:1; padding:10px; background:none; border:none; color:var(--text2); font-size:.85rem; font-weight:600; cursor:pointer; border-bottom:2px solid transparent; transition:all .15s; }
.sb-tab:hover { color:var(--text); background:rgba(255,255,255,.04); }
.sb-tab.active { color:var(--accent2); border-bottom-color:var(--accent); background:rgba(99,102,241,.1); }

/* ── Feedback components ── */
.sb-spinner { border-radius:50%; border-style:solid; animation:sbspin .75s linear infinite; }
@keyframes sbspin { to { transform:rotate(360deg); } }
.sb-tip { position:relative; display:inline-flex; }
.sb-tip::after { content:attr(data-tip); position:absolute; bottom:calc(100% + 8px); left:50%; transform:translateX(-50%); background:#1e293b; color:var(--text); padding:6px 10px; border-radius:6px; font-size:.78rem; white-space:nowrap; pointer-events:none; opacity:0; transition:opacity .15s; border:1px solid var(--bg3); z-index:50; }
.sb-tip:hover::after { opacity:1; }
.sb-tip-success::after { background:#065f46; color:#a7f3d0; border-color:#10b981; }
.sb-tip-error::after   { background:#7f1d1d; color:#fecaca; border-color:#ef4444; }
.sb-tip-warn::after    { background:#78350f; color:#fde68a; border-color:#f59e0b; }

/* ── Vue tooltip bubble ── */
.sb-tip-bubble { position:absolute; bottom:calc(100% + 10px); left:50%; transform:translateX(-50%); background:#1e293b; color:var(--text); padding:8px 12px; border-radius:8px; font-size:.8rem; white-space:nowrap; border:1px solid var(--bg3); box-shadow:0 4px 16px rgba(0,0,0,.5); z-index:50; pointer-events:none; }
.sb-tip-arrow { position:absolute; bottom:-5px; left:50%; transform:translateX(-50%) rotate(45deg); width:8px; height:8px; background:#1e293b; border-right:1px solid var(--bg3); border-bottom:1px solid var(--bg3); }
.sb-tip-fade-enter-active, .sb-tip-fade-leave-active { transition:opacity .15s; }
.sb-tip-fade-enter-from, .sb-tip-fade-leave-to { opacity:0; }
.sb-skeleton { background:linear-gradient(90deg,var(--bg3) 25%,#3d536a 50%,var(--bg3) 75%); background-size:200% 100%; animation:sbshimmer 1.5s infinite; }
@keyframes sbshimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
kbd { display:inline-block; padding:3px 8px; background:var(--bg3); border:1px solid #475569; border-bottom-width:2px; border-radius:5px; font-family:monospace; font-size:.82rem; color:var(--text); }

/* ── Toast ── */
.sb-toast { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:12px 16px; border-radius:10px; font-size:.88rem; font-weight:600; min-width:260px; box-shadow:0 8px 24px rgba(0,0,0,.4); animation:sb-slide-in .2s ease; }
@keyframes sb-slide-in { from{transform:translateX(40px);opacity:0} to{transform:translateX(0);opacity:1} }
.sb-toast-success { background:#065f46; color:#a7f3d0; border:1px solid #10b981; }
.sb-toast-error   { background:#7f1d1d; color:#fecaca;  border:1px solid #ef4444; }
.sb-toast-info    { background:#1e3a5f; color:#bfdbfe;  border:1px solid #3b82f6; }
.sb-toast-warn    { background:#78350f; color:#fde68a;  border:1px solid #f59e0b; }

/* ── Heatmap ── */
.sb-heatmap-grid { display:grid; grid-template-rows:repeat(7,12px); grid-auto-flow:column; grid-auto-columns:12px; gap:2px; }
.sb-heatmap-cell { border-radius:2px; cursor:pointer; transition:opacity .1s; }
.sb-heatmap-cell:hover { opacity:.7; }

/* ── Data Table ── */
.sb-table { width:100%; border-collapse:collapse; font-size:.85rem; }
.sb-table th { padding:10px 12px; text-align:left; background:var(--bg3); color:var(--text2); font-weight:700; font-size:.78rem; text-transform:uppercase; letter-spacing:.04em; cursor:pointer; user-select:none; border-bottom:2px solid #475569; white-space:nowrap; }
.sb-table th:hover { color:var(--text); }
.sb-table td { padding:10px 12px; border-bottom:1px solid var(--bg3); }
.sb-table tr { cursor:pointer; transition:background .1s; }
.sb-table tr:hover td { background:rgba(255,255,255,.03); }
.sb-row-selected td { background:rgba(99,102,241,.1) !important; }

/* ── Spreadsheet Grid ── */
.sb-grid { width:100%; border-collapse:collapse; font-size:.82rem; font-family:monospace; }
.sb-grid th { background:var(--bg3); color:var(--text2); padding:5px 10px; text-align:center; font-weight:700; border:1px solid #475569; min-width:80px; font-family:monospace; }
.sb-grid td { border:1px solid #3d4f60; padding:0; min-width:90px; height:30px; }
.sb-grid-rownum { background:var(--bg3); color:var(--text2); text-align:center; font-size:.75rem; padding:0 6px; cursor:default; width:32px; min-width:0; }
.sb-grid-td-selected { outline:2px solid var(--accent); outline-offset:-2px; z-index:1; position:relative; }
.sb-grid-cell { display:block; width:100%; height:100%; padding:5px 8px; cursor:cell; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; line-height:20px; }
.sb-grid-header-cell { font-weight:700; color:var(--text2); background:rgba(255,255,255,.03); }
.sb-grid-cell:hover { background:rgba(255,255,255,.04); }
.sb-grid-input { width:100%; height:100%; padding:4px 8px; background:rgba(99,102,241,.12); border:2px solid var(--accent); color:var(--text); font-family:monospace; font-size:.82rem; outline:none; }

/* ── Pagination ── */
.sb-pagination { display:flex; gap:4px; flex-wrap:wrap; align-items:center; }
.sb-page-btn { min-width:36px; height:36px; padding:0 10px; background:var(--bg3); border:1px solid #475569; border-radius:6px; color:var(--text2); font-size:.85rem; font-weight:600; cursor:pointer; transition:all .15s; }
.sb-page-btn:hover:not(:disabled) { background:#475569; color:var(--text); border-color:var(--accent); }
.sb-page-btn.active { background:var(--accent); color:#fff; border-color:var(--accent); }
.sb-page-btn:disabled { opacity:.35; cursor:not-allowed; }

/* ── Breadcrumb ── */
.sb-breadcrumb { display:flex; flex-wrap:wrap; align-items:center; gap:4px; }
.sb-crumb-item { display:flex; align-items:center; gap:4px; }
.sb-crumb-btn { background:none; border:none; padding:4px 8px; border-radius:5px; color:var(--text2); font-size:.9rem; cursor:pointer; transition:all .15s; }
.sb-crumb-btn:hover { color:var(--text); background:var(--bg3); }
.sb-crumb-btn.active { color:var(--text); font-weight:700; cursor:default; }
.sb-crumb-sep { color:var(--text2); font-size:.85rem; user-select:none; }

/* ── Stepper ── */
.sb-stepper { display:flex; align-items:center; flex-wrap:wrap; gap:0; }
.sb-step { display:flex; flex-direction:column; align-items:center; gap:6px; cursor:pointer; }
.sb-step-circle { width:36px; height:36px; border-radius:50%; background:var(--bg3); border:2px solid #475569; display:flex; align-items:center; justify-content:center; font-size:.85rem; font-weight:700; color:var(--text2); transition:all .25s; }
.sb-step.done .sb-step-circle  { background:var(--green);  border-color:var(--green);  color:#fff; }
.sb-step.active .sb-step-circle { background:var(--accent); border-color:var(--accent); color:#fff; }
.sb-step-label { font-size:.72rem; color:var(--text2); white-space:nowrap; }
.sb-step.active .sb-step-label { color:var(--accent2); font-weight:700; }
.sb-step.done .sb-step-label  { color:var(--green); }
.sb-step-line { flex:1; height:2px; background:#475569; min-width:20px; align-self:center; margin-bottom:22px; transition:background .25s; }
.sb-step-line.done { background:var(--green); }

/* ── Timeline ── */
.sb-timeline { display:flex; flex-direction:column; }
.sb-timeline-item { display:flex; gap:16px; }
.sb-timeline-connector { display:flex; flex-direction:column; align-items:center; flex-shrink:0; }
.sb-timeline-icon { width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1rem; flex-shrink:0; }
.sb-timeline-line { width:2px; flex:1; background:var(--bg3); margin:4px 0; min-height:24px; }
.sb-timeline-body { padding-bottom:20px; flex:1; padding-top:6px; }

/* ── Dropdown ── */
.sb-dropdown { position:absolute; top:calc(100% + 6px); left:0; background:var(--bg2); border:1px solid var(--bg3); border-radius:10px; padding:6px; min-width:200px; box-shadow:0 8px 24px rgba(0,0,0,.4); z-index:100; }
.sb-dropdown-item { width:100%; display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:6px; background:none; border:none; color:var(--text); font-size:.88rem; cursor:pointer; text-align:left; transition:background .1s; white-space:nowrap; }
.sb-dropdown-item:hover { background:var(--bg3); }
.sb-dropdown-item.danger { color:var(--red); }
.sb-dropdown-item.active { background:rgba(99,102,241,.15); color:var(--accent2); }
.sb-dropdown-divider { height:1px; background:var(--bg3); margin:4px 0; }
.sb-dropdown-kbd { margin-left:auto; font-size:.72rem; color:var(--text2); font-family:monospace; }

/* ── Range slider ── */
.sb-range { -webkit-appearance:none; appearance:none; width:100%; height:6px; border-radius:999px; background:linear-gradient(to right, var(--accent) 0%, var(--accent) var(--pct,50%), var(--bg3) var(--pct,50%), var(--bg3) 100%); outline:none; cursor:pointer; }
.sb-range::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:var(--accent); border:2px solid #fff; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,.4); }

/* ── Color picker ── */
.sb-color-picker { -webkit-appearance:none; appearance:none; width:44px; height:44px; border:none; border-radius:8px; padding:0; cursor:pointer; background:none; }
.sb-color-picker::-webkit-color-swatch-wrapper { padding:0; }
.sb-color-picker::-webkit-color-swatch { border:2px solid var(--bg3); border-radius:8px; }

/* ── Popover ── */
.sb-popover { position:absolute; background:var(--bg2); border:1px solid var(--bg3); border-radius:10px; padding:14px 16px; max-width:220px; box-shadow:0 8px 24px rgba(0,0,0,.5); z-index:200; }

/* ── Status pulse dot ── */
.sb-pulse-dot { animation:sb-status-pulse 2s ease-in-out infinite; }
@keyframes sb-status-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.5)} 50%{box-shadow:0 0 0 5px rgba(34,197,94,0)} }

/* ── Edit hint ── */
td:hover .sb-edit-hint { opacity:1 !important; }

/* ── Animations ── */
@keyframes sb-pulse   { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(0.9);opacity:.6} }
@keyframes sb-bounce  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
@keyframes sb-shake   { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
@keyframes sb-slidein { from{transform:translateX(-20px);opacity:0} to{transform:translateX(0);opacity:1} }
@keyframes sb-flip    { 0%{transform:rotateY(0)} 50%{transform:rotateY(90deg)} 100%{transform:rotateY(0)} }
@keyframes sb-blink   { 0%,100%{opacity:1} 50%{opacity:0} }
@keyframes sb-loading-bar { 0%{width:0%} 70%{width:100%} 100%{width:100%;opacity:0} }
@keyframes fadein     { from{opacity:0} to{opacity:1} }

/* ── Spreadsheet ── */
.sb-cell-input { width:100%; border:none; background:transparent; color:var(--text); font-family:monospace; font-size:.85rem; padding:8px 12px; outline:none; transition:background .1s; }
.sb-cell-input:focus { background:rgba(99,102,241,.12); }
.sb-spreadsheet td { padding:0; }

/* ── Freeze columns ── */
.sb-sticky-col { position:sticky; left:0; background:var(--bg2); z-index:1; box-shadow:2px 0 6px rgba(0,0,0,.2); }
.sb-table thead .sb-sticky-col { background:var(--bg3); }

/* ── Virtual List ── */
.sb-virtual-container { height:288px; overflow-y:auto; border:1px solid var(--bg3); border-radius:8px; position:relative; }
.sb-virtual-row { display:flex; align-items:center; gap:16px; padding:0 16px; height:36px; border-bottom:1px solid var(--bg3); font-size:.85rem; box-sizing:border-box; }
.sb-virtual-row:hover { background:rgba(255,255,255,.04); }

/* ── Rich Text Editor ── */
.sb-rte { border:1px solid var(--bg3); border-radius:8px; overflow:hidden; }
.sb-rte-toolbar { display:flex; gap:3px; align-items:center; padding:6px 10px; background:var(--bg3); flex-wrap:wrap; }
.sb-rte-btn { background:none; border:1px solid transparent; padding:4px 8px; border-radius:5px; cursor:pointer; color:var(--text); font-size:.85rem; line-height:1.4; }
.sb-rte-btn:hover { background:var(--bg2); border-color:rgba(255,255,255,.1); }
.sb-rte-sep { width:1px; height:18px; background:rgba(255,255,255,.15); margin:0 4px; }
.sb-rte-body { min-height:130px; padding:14px 16px; font-size:.9rem; line-height:1.7; outline:none; }
.sb-rte-body:focus { background:rgba(99,102,241,.04); }

/* ── Date Picker ── */
.sb-calendar { display:inline-block; max-width:300px; }
.sb-cal-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; gap:8px; }
.sb-cal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:2px; }
.sb-cal-day-name { text-align:center; font-size:.7rem; font-weight:700; color:var(--text2); padding:4px 0; text-transform:uppercase; }
.sb-cal-day { text-align:center; padding:7px 2px; border-radius:6px; font-size:.84rem; cursor:pointer; transition:background .1s; min-height:32px; }
.sb-cal-day:not(.sb-cal-day--empty):hover { background:var(--bg3); }
.sb-cal-day--selected { background:var(--accent) !important; color:#fff; font-weight:700; }
.sb-cal-day--empty { cursor:default; pointer-events:none; }

/* ── File Upload ── */
.sb-dropzone { border:2px dashed var(--bg3); border-radius:12px; padding:36px 24px; text-align:center; transition:border-color .2s,background .2s; cursor:default; }
.sb-dropzone--active { border-color:var(--accent); background:rgba(99,102,241,.07); }
.sb-file-item { display:flex; align-items:center; gap:10px; padding:8px 12px; background:var(--bg2); border:1px solid var(--bg3); border-radius:8px; }

/* ── Dashboard ── */
.sb-dashboard { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
.sb-dash-stat  { background:var(--bg2); border:1px solid var(--bg3); border-radius:10px; padding:16px 18px; }
.sb-dash-chart { background:var(--bg2); border:1px solid var(--bg3); border-radius:10px; padding:16px 18px; }

@media(max-width:768px) {
  .sb-sidebar { display:none; }
  .sb-section      { padding:24px 20px; }
  .sb-page-header  { padding:24px 20px; }
  .sb-page-title   { font-size:1.4rem; }
  .sb-dashboard    { grid-template-columns:repeat(2,1fr); }
  .sb-dash-chart   { grid-column:span 2; }
}
</style>
