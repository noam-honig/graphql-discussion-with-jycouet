<script lang="ts">
  import { remult } from 'remult'
  import type { ClassType } from 'remult/classType'
  import { createEventDispatcher, onDestroy } from 'svelte'
  import { writable } from 'svelte/store'

  export let entity: ClassType<any>
  export let mode: 'create' | 'update' | 'readonly' = 'readonly'
  export let id: string | number | null = null

  export let with_allowNull: boolean | undefined = undefined
  export let with_readonly: boolean | undefined = undefined
  export let with_hideInCreate: boolean | undefined = undefined

  $: id &&
    currentRepo.findId(id).then(data => {
      dataUpdate = data
      $data = data
    })

  $: mode === 'create' && ($data = { ...dataCreate }) && console.log(`dataCreate`, dataCreate)
  $: mode === 'update' && ($data = { ...dataUpdate }) && console.log(`dataUpdate`, dataUpdate)
  $: mode === 'readonly' && ($data = { ...dataUpdate }) && console.log(`dataUpdate`, dataUpdate)

  const dispatch = createEventDispatcher()

  function dispatchCreate(_data: any) {
    dispatch('create', { _data })
  }

  function dispatchUpdate(_data: any) {
    dispatch('update', { _data })
  }

  onDestroy(() => {
    id = null
  })

  const currentRepo = remult.repo(entity)

  type Field = {
    key: string
    caption: string
    inputType: string
    allowNull: boolean
    readOnly: boolean
    hideInCreate: boolean
    selectOptions: Record<string, string>
    defaultInsert?: string
    placeholder?: string
  }
  const fields: Field[] = []

  let errors = writable<Record<string, string>>({})
  let data = writable<Record<string, any>>({})
  let dataCreate: Record<string, any> = {}
  let dataUpdate: Record<string, any> = {}

  for (const key in currentRepo.metadata.fields) {
    // taskRepo.metadata.fields
    if (Object.prototype.hasOwnProperty.call(currentRepo.metadata.fields, key)) {
      // const field = taskRepo.metadata.fields[key as keyof Task]!
      const remultField = currentRepo.metadata.fields[key]!

      if (remultField.key === undefined) {
        // remove functions...
      } else {
        // console.log(`field`, remultField.key, remultField)
        const field: Field = {
          key: remultField.key,
          caption: remultField.caption,
          inputType: remultField.inputType ?? 'text',
          allowNull: remultField.allowNull,
          readOnly: remultField.dbReadOnly,
          hideInCreate: remultField.options.hideInCreate ?? false,
          selectOptions: remultField.options.selectOptions ?? {},
          defaultInsert:
            remultField.options.defaultInsert ??
            (remultField.inputType === 'date' ? new Date().toISOString().split('T')[0] : undefined),
          placeholder: remultField.options.placeholder ?? '',
        }

        dataCreate[field.key] = field.defaultInsert
        if (mode === 'create') {
          $data[field.key] = field.defaultInsert
        }
        $errors[field.key] = ''

        fields.push(field)
      }
    }
  }

  const submit = async (e: Event) => {
    try {
      if (mode === 'update') {
        const dataNew = await currentRepo.save($data)
        $data = { ...dataNew }
        dispatchUpdate(dataNew)
      } else if (mode === 'create') {
        const dataNew = await currentRepo.insert($data)
        for (const key in $data) {
          $data[key] = fields.find(c => c.key === key)!.defaultInsert
          $errors[key] = ''
        }
        dispatchCreate(dataNew)
      }
    } catch (error) {
      // @ts-ignore
      $errors = { ...$errors, ...error.modelState }
    }
  }

  export function common(node: any, field: Field) {
    node['id'] = field.key
    node['name'] = field.key
    node['disabled'] = field.readOnly
    node['placeholder'] = field.placeholder

    return {
      destroy() {
        // document.removeEventListener("click", handleClick, true);
      },
    }
  }
</script>

<form on:submit|preventDefault={submit}>
  {#each fields.filter(c => {
    if (with_allowNull === undefined && with_readonly === undefined && with_hideInCreate === undefined) {
      if (mode === 'create') {
        with_readonly = false
        with_allowNull = false
        with_hideInCreate = true
      } else {
        with_readonly = false
        // with_allowNull = true
        with_allowNull = false
        with_hideInCreate = false
      }
    }
    const allowNull = with_allowNull ? true : !c.allowNull
    const readOnly = with_readonly ? true : !c.readOnly
    const hideInCreate = with_hideInCreate ? !c.hideInCreate : true

    return allowNull && readOnly && hideInCreate
  }) as field}
    <div class="field">
      <label for={field.key}>
        <p class="caption">
          <span>{field.caption}</span><span class="error">{$errors[field.key]}</span>
        </p>
        <div class="input">
          {#if mode === 'readonly'}
            <p style="padding-top: 0.6rem; padding-left: 0.6rem;">
              {#if field.inputType === 'checkbox'}
                {$data[field.key] ? 'Yes' : 'No'}
              {:else if field.inputType === 'date'}
                {new Date($data[field.key]).toLocaleDateString()}
              {:else if field.inputType === 'select'}
                {field.selectOptions[$data[field.key]]}
              {:else}
                {$data[field.key]}
              {/if}
            </p>
          {:else if field.inputType === 'text'}
            <input use:common={field} type="text" bind:value={$data[field.key]} />
          {:else if field.inputType === 'number'}
            <input use:common={field} type="number" bind:value={$data[field.key]} />
          {:else if field.inputType === 'checkbox'}
            <div style="padding-top: 12px;">
              <input use:common={field} type="checkbox" bind:checked={$data[field.key]} />
            </div>
          {:else if field.inputType === 'date'}
            <input use:common={field} type="date" bind:value={$data[field.key]} />
          {:else if field.inputType === 'select'}
            <select use:common={field} bind:value={$data[field.key]}>
              {#each Object.entries(field.selectOptions) as item}
                <option value={item[0]}>{item[1]}</option>
              {/each}
            </select>
          {:else}
            <pre>{field.inputType} not managed!</pre>
          {/if}
        </div>
      </label>
    </div>
  {/each}
  {#if mode !== 'readonly'}
    <div class="buttonSubmit">
      <button type="submit">{mode === 'create' ? 'Create' : 'Update'}</button>
    </div>
  {/if}
</form>

<style>
  .error {
    color: red;
  }
  .field {
    margin-bottom: 1rem;
    width: 100%;
  }
  .caption {
    padding-left: 0.7rem;
    height: 1rem;
    display: flex;
    justify-content: space-between;
  }
  .input {
    height: 2rem;
  }
</style>
