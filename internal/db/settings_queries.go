package db

import (
	"context"
)

func (r *Repository) GetSetting(key string) (string, error) {
	return r.queries.GetSetting(context.Background(), key)
}

func (r *Repository) SetSetting(key, val string) error {
	return r.queries.SetSetting(context.Background(), SetSettingParams{
		Key:   key,
		Value: val,
	})
}
