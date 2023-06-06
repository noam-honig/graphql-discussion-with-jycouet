<script lang="ts">
  import { displayValue } from '$lib/remult-svelte/helper'
  import { CheckIcon } from 'lucide-svelte'
  import { Checkbox, Label } from 'radix-svelte'
  import type { FieldMetadata, Repository } from 'remult'
  import { createEventDispatcher } from 'svelte'
  import { writable } from 'svelte/store'

  import Input from './Input.svelte'

  export let repo: Repository<any>
  export let include: FieldMetadata[] = []
  export let exclude: FieldMetadata[] = []
  export let mode: 'create' | 'update' | 'readonly' = 'readonly'
  export let id: string | number | null = null

  let data = writable<Record<string, any>>({})
  let errors = writable<Record<string, string>>({})

  $: reset(mode)

  const resetErrors = () => {
    $errors = repo.fields
      .toArray()
      .map(c => c.key)
      .reduce((acc, key) => ({ ...acc, [key]: '' }), {})
  }

  const reset = async (_mode: 'create' | 'update' | 'readonly') => {
    resetErrors()
    if (!!id && (_mode === 'update' || _mode === 'readonly')) {
      $data = { ...(await repo.findId(id, { useCache: false })) }
    } else {
      $data = { ...repo.create() }
    }
  }

  const dispatch = createEventDispatcher()

  const dispatchCreate = (_data: any) => {
    dispatch('create', { _data })
  }

  const dispatchUpdate = (_data: any) => {
    dispatch('update', { _data })
  }

  const submit = async (e: Event) => {
    try {
      if (mode === 'update') {
        $data = await repo.save($data)
      } else if (mode === 'create') {
        $data = await repo.insert($data)
      }
    } catch (error) {
      // @ts-ignore
      $errors = { ...$errors, ...error.modelState }
      return
    }

    // inform others if everything is all right
    if (mode === 'update') {
      dispatchUpdate($data)
    } else if (mode === 'create') {
      dispatchCreate($data)
    }
  }

  const common = (field: FieldMetadata<any, any>) => {
    return {
      id: field.key,
      name: field.key,
      disabled: field.dbReadOnly || field.options.allowApiUpdate === false,
      placeholder: field.options?.placeholder ?? '',
    }
  }

  const getValues = (field: any) => {
    return field.options?.valueConverter?.values
  }
</script>

<!-- error? -->

<form on:submit|preventDefault={submit}>
  {#each repo.fields.toArray().filter(f => {
    const isExcluded = exclude.map(c => c.key).includes(f.key)
    if (isExcluded) {
      return false
    }
    const isIncluded = include.map(c => c.key).includes(f.key)
    if (isIncluded) {
      return true
    }

    // good defaults?
    let with_readonly = false
    let with_allowNull = false

    if (mode === 'create') {
      with_readonly = false
      with_allowNull = false
    } else if (mode === 'update') {
      with_readonly = false
      with_allowNull = true
    }

    const allowNull = with_allowNull ? true : !f.allowNull
    const readOnly = with_readonly ? true : !f.dbReadOnly && f.options.allowApiUpdate === undefined

    return allowNull && readOnly
  }) as field}
    {@const inputType = field.inputType}
    <div>
      <Label.Root for={field.key}>{field.caption}</Label.Root>
      <Label.Root>{$errors[field.key]}</Label.Root>
    </div>
    {#if mode === 'readonly'}
      <Label.Root>{displayValue(field, $data)}</Label.Root>
    {:else if inputType === 'checkbox'}
      <!-- <Checkbox.Root {...common(field)} bind:checked={$data[field.key]} /> -->

      <!-- disabled={rootDisabled} -->
      <!-- name={rootName}
			value={rootValue}
			required={rootRequired} -->
      <!-- <Checkbox.Root {...common(field)} bind:checked={$data[field.key]}>
        <Checkbox.Indicator>x</Checkbox.Indicator>
      </Checkbox.Root>
      <Label.Root for={field.key}>{field.caption}</Label.Root> -->

      <!-- <div class="cb">
        <Checkbox.Root class="CheckboxRoot" checked id="c1">
          <Checkbox.Indicator class="CheckboxIndicator">
            <CheckIcon />
          </Checkbox.Indicator>
        </Checkbox.Root>
        <label class="Label" for="c1"> Accept terms and conditions. </label>
      </div> -->

      <Checkbox.Root class="checkbox" id="c1" bind:checked={$data[field.key]} />

      <!-- <input type="checkbox" checked="checked" class="checkbox" /> -->

      <!-- <Checkbox {...common(field)} bind:checked={$data[field.key]} /> -->
    {:else if inputType === 'select'}
      <!-- Whaiting for the "comming soon" feature -->
      <select
        {...common(field)}
        value={field.toInput($data[field.key])}
        on:change={e => {
          // @ts-ignore
          $data[field.key] = field.fromInput(e.target.value)
        }}
      >
        {#each getValues(field) ?? [] as { id, caption }}
          <option value={id}>{caption}</option>
        {/each}
      </select>
    {:else}
      <Input
        {...common(field)}
        type={inputType}
        value={field.toInput($data[field.key])}
        on:change={e => {
          // @ts-ignore
          $data[field.key] = field.fromInput(e.target.value)
        }}
      />
    {/if}
  {/each}

  {#if mode !== 'readonly'}
    <button type="submit">{mode === 'create' ? 'Create' : 'Update'}</button>
  {/if}
</form>

<!-- <style>
  .cb {
    display: 'flex';
    align-items: 'center';
  }
  /* reset */
  /* button {
    all: unset;
  } */

  .CheckboxRoot {
    background-color: white;
    width: 25px;
    height: 25px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 10px var(--blackA7);
  }
  .CheckboxRoot:hover {
    background-color: var(--violet3);
  }
  .CheckboxRoot:focus {
    box-shadow: 0 0 0 2px black;
  }

  .CheckboxIndicator {
    color: var(--violet11);
  }

  .Label {
    color: white;
    padding-left: 15px;
    font-size: 15px;
    line-height: 1;
  }
</style> -->
