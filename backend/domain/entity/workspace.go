package entity

import "time"

type Workspace struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

func (w *Workspace) ChangeName(name string) {
	w.Name = name
	w.UpdatedAt = time.Now()
}
